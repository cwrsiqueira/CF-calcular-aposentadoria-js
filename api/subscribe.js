module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, lang } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = lang === 'en'
    ? parseInt(process.env.BREVO_LIST_ID_EN || '14', 10)
    : parseInt(process.env.BREVO_LIST_ID || '13', 10);

  if (!apiKey) {
    return res.status(500).json({ error: 'Configuração do servidor incompleta' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    // 201 = criado, 204 = já existia (updateEnabled atualiza silenciosamente)
    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json().catch(() => ({}));
    console.error('Brevo error:', response.status, data);
    return res.status(500).json({ error: 'Erro ao cadastrar email' });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
