(function () {
  const form  = document.getElementById('emailForm');
  if (!form) return;

  const input = document.getElementById('emailInput');
  const btn   = document.getElementById('emailBtn');
  const msg   = document.getElementById('emailMsg');
  const isEn  = window.location.pathname.startsWith('/en');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return;

    btn.disabled = true;
    btn.textContent = isEn ? 'Sending...' : 'Enviando...';
    msg.textContent = '';
    msg.className = 'email-msg';

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: isEn ? 'en' : 'pt' }),
      });

      const data = await res.json();

      if (res.ok) {
        msg.textContent = isEn
          ? '✓ Subscribed! You\'ll receive updates soon.'
          : '✓ Cadastrado! Você receberá as novidades em breve.';
        msg.className = 'email-msg success';
        form.querySelector('.email-row').style.display = 'none';
      } else {
        throw new Error(data.error || (isEn ? 'Error. Please try again.' : 'Erro ao cadastrar'));
      }
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'email-msg error';
      btn.disabled = false;
      btn.textContent = isEn ? 'Subscribe' : 'Quero novidades';
    }
  });
})();
