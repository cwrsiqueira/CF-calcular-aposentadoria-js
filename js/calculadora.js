/* ===== INTERNACIONALIZAÇÃO ===== */
const LANG = window.location.pathname.startsWith('/en') ? 'en' : 'pt';
const L = LANG === 'en' ? {
  idadeAtual:    'Current Age:',
  idadeAposen:   'Retirement Age:',
  prazo:         'Period:',
  vi:            'Initial Amount:',
  vr:            'Monthly Contribution:',
  invest:        'Total Invested:',
  rend:          'Returns:',
  acum:          'Accumulated Value:',
  taxa:          'Monthly Rate:',
  taxaA:         'Annual Rate:',
  renda:         'Retirement Income:',
  alertOneBlank: 'Leave exactly one field blank for calculation.',
  alertInvalid:  'Invalid values. Please check your inputs and try again.',
  resultPage:    '/en/results.html',
  homePage:      '/en/',
} : {
  idadeAtual:    'Idade Atual:',
  idadeAposen:   'Idade Aposentadoria:',
  prazo:         'Prazo:',
  vi:            'Valor Inicial:',
  vr:            'Aporte Mensal:',
  invest:        'Total Investido:',
  rend:          'Rendimentos:',
  acum:          'Valor Acumulado:',
  taxa:          'Taxa Mensal:',
  taxaA:         'Taxa Anual:',
  renda:         'Renda de Aposentadoria:',
  alertOneBlank: 'Deixe apenas um campo em branco para cálculo.',
  alertInvalid:  'Valores informados levam a resultados inválidos. Verifique os dados e tente novamente.',
  resultPage:    '/results.html',
  homePage:      '/',
};

/* ===== MÁSCARAS (vanilla JS) ===== */
function applyMoneyMask(input) {
  input.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '');
    if (!val) { this.value = ''; return; }
    if (val.length > 11) val = val.slice(-11);
    const num = parseInt(val, 10);
    this.value = Math.floor(num / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + (num % 100).toString().padStart(2, '0');
  });
}

function applyPercentMask(input) {
  input.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '');
    if (!val) { this.value = ''; return; }
    if (val.length > 5) val = val.slice(-5);
    const num = parseInt(val, 10);
    this.value = Math.floor(num / 100).toString() + ',' + (num % 100).toString().padStart(2, '0');
  });
}

document.querySelectorAll('.value').forEach(applyMoneyMask);
document.querySelectorAll('.percent').forEach(applyPercentMask);

/* ===== SESSION STORAGE — RESTAURAR CAMPOS ===== */
['idade_atual', 'idade_aposentadoria', 'txPeriodoAnual', 'valorInicial', 'valorRecorrente', 'aposentadoria']
  .forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = sessionStorage.getItem(id) ?? '';
  });

document.querySelector('#btn-reset')?.addEventListener('click', function () {
  sessionStorage.clear();
  document.querySelector('#rendaForm')?.reset();
});

/* ===== HELPERS ===== */
function formatarValor(valor, sistema = true) {
  if (sistema) return valor.replace(/\./g, '').replace(',', '.');
  return valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function calcularAnosEMeses(n) {
  const anos = Math.floor(n / 12), meses = n % 12;
  if (LANG === 'en') {
    const a = anos === 1 ? '1 year' : `${anos} years`;
    const m = meses === 1 ? '1 month' : `${meses} months`;
    if (anos === 0) return m;
    if (meses === 0) return `${a} (or ${n} months)`;
    return `${a} and ${m} (or ${n} months)`;
  }
  const a = anos === 1 ? '1 ano' : `${anos} anos`;
  const m = meses === 1 ? '1 mês' : `${meses} meses`;
  if (anos === 0) return m;
  if (meses === 0) return `${a} (ou ${n} meses)`;
  return `${a} e ${m} (ou ${n} meses)`;
}

/* ===== DADOS DO GRÁFICO ===== */
function gerarDadosGrafico(vi, aporte, taxa, n) {
  if (n <= 0) return [];
  const step = n > 120 ? Math.ceil(n / 60) : n > 24 ? 3 : 1;
  const pontos = [];
  for (let m = 0; m <= n; m += step) {
    const acum = taxa > 0
      ? vi * Math.pow(1 + taxa / 100, m) + aporte * ((Math.pow(1 + taxa / 100, m) - 1) / (taxa / 100))
      : vi + aporte * m;
    pontos.push({ m, acum: Math.max(0, acum), invest: vi + aporte * m });
  }
  if (pontos[pontos.length - 1].m !== n) {
    const acum = taxa > 0
      ? vi * Math.pow(1 + taxa / 100, n) + aporte * ((Math.pow(1 + taxa / 100, n) - 1) / (taxa / 100))
      : vi + aporte * n;
    pontos.push({ m: n, acum: Math.max(0, acum), invest: vi + aporte * n });
  }
  return pontos;
}

/* ===== CÁLCULO PRINCIPAL ===== */
function calcularAposentadoria() {
  const idadeAtualVal      = document.getElementById('idade_atual').value.trim();
  const idadeAposenVal     = document.getElementById('idade_aposentadoria').value.trim();
  const txPeriodoAnualVal  = document.getElementById('txPeriodoAnual').value.trim();
  const valorInicialVal    = document.getElementById('valorInicial').value.trim();
  const valorRecorrenteVal = document.getElementById('valorRecorrente').value.trim();
  const aposentadoriaVal   = document.getElementById('aposentadoria').value.trim();

  // Deriva período a partir das idades
  const periodoAnual = parseFloat(idadeAposenVal) - parseFloat(idadeAtualVal);
  const periodo = (idadeAposenVal === '' || idadeAposenVal === '0' || idadeAtualVal === '' || idadeAtualVal === '0')
    ? '' : String(Math.floor(periodoAnual * 12));

  // Converte taxa anual → mensal para uso nos cálculos
  const txPeriodoVal = txPeriodoAnualVal !== ''
    ? ((Math.pow(1 + parseFloat(formatarValor(txPeriodoAnualVal)) / 100, 1 / 12) - 1) * 100).toFixed(4).replace('.', ',')
    : '';

  // Salva campos de entrada para restaurar
  sessionStorage.setItem('idade_atual', idadeAtualVal);
  sessionStorage.setItem('idade_aposentadoria', idadeAposenVal);
  sessionStorage.setItem('txPeriodoAnual', txPeriodoAnualVal);
  sessionStorage.setItem('valorInicial', valorInicialVal);
  sessionStorage.setItem('valorRecorrente', valorRecorrenteVal);
  sessionStorage.setItem('aposentadoria', aposentadoriaVal);

  // Detecta campo em branco — ordem: [periodo, valorInicial, valorRecorrente, taxa, aposentadoria]
  const camposParaCalculo = [periodo, valorInicialVal, valorRecorrenteVal, txPeriodoVal, aposentadoriaVal];
  let totalVazios = 0, campoEmBranco = -1;
  camposParaCalculo.forEach((item, index) => {
    if (item === '') { totalVazios++; campoEmBranco = index; }
  });

  if (totalVazios !== 1) {
    alert(L.alertOneBlank);
    return;
  }

  sessionStorage.setItem('campoCalculado', campoEmBranco);

  let prazo       = periodo ? parseInt(periodo) : 0;
  let taxa        = txPeriodoVal ? parseFloat(formatarValor(txPeriodoVal)) : 0;
  let taxaAnual   = txPeriodoAnualVal ? parseFloat(formatarValor(txPeriodoAnualVal)) : 0;
  let inicial     = valorInicialVal ? parseFloat(formatarValor(valorInicialVal)) : 0;
  let recorrente  = valorRecorrenteVal ? parseFloat(formatarValor(valorRecorrenteVal)) : 0;
  let renda       = aposentadoriaVal ? parseFloat(formatarValor(aposentadoriaVal)) : 0;
  let idadeAtualCalculada    = parseFloat(idadeAtualVal) || 0;
  let idadeAposenCalculada   = parseFloat(idadeAposenVal) || 0;
  let investido, rendimentos, acumulado;

  switch (campoEmBranco) {
    case 0: { // Calcular o prazo (e a idade em branco)
      let vlrAtual = inicial;
      const montante = renda / (taxa / 100);
      let loop = 0;
      while (vlrAtual * (1 + taxa / 100) + recorrente < montante) {
        vlrAtual = vlrAtual * (1 + taxa / 100) + recorrente;
        loop++;
      }
      prazo = loop;
      idadeAtualCalculada  = idadeAtualVal === '' || parseFloat(idadeAtualVal) === 0
        ? parseFloat(idadeAposenVal) - Math.floor(prazo / 12)
        : parseFloat(idadeAtualVal);
      idadeAposenCalculada = idadeAposenVal === '' || parseFloat(idadeAposenVal) === 0
        ? parseFloat(idadeAtualVal) + Math.floor(prazo / 12)
        : parseFloat(idadeAposenVal);
      investido  = inicial + recorrente * prazo;
      rendimentos = vlrAtual - investido;
      acumulado  = vlrAtual;
      renda      = acumulado * (taxa / 100);
      break;
    }
    case 1: { // Calcular valor inicial
      const montante = renda / (taxa / 100);
      const taxaAtu  = Math.pow(1 + taxa / 100, prazo);
      inicial    = (montante - recorrente * ((taxaAtu - 1) / (taxa / 100))) / taxaAtu;
      investido  = inicial + recorrente * prazo;
      rendimentos = montante - investido;
      acumulado  = montante;
      renda      = acumulado * (taxa / 100);
      break;
    }
    case 2: { // Calcular aporte mensal
      const montante  = renda / (taxa / 100);
      const inicialAtu = inicial * Math.pow(1 + taxa / 100, prazo);
      const taxaAtu   = (Math.pow(1 + taxa / 100, prazo) - 1) / (taxa / 100);
      recorrente = parseFloat(((montante - inicialAtu) / taxaAtu).toFixed(2));
      investido  = inicial + recorrente * prazo;
      rendimentos = montante - investido;
      acumulado  = montante;
      renda      = acumulado * (taxa / 100);
      break;
    }
    case 3: { // Calcular taxa
      let t = 0.01, montAtu = 0, taxaAtu2 = 0;
      while (true) {
        const mont = inicial * Math.pow(1 + t / 100, prazo)
          + recorrente * ((Math.pow(1 + t / 100, prazo) - 1) / (t / 100));
        if (mont * (t / 100) >= renda) break;
        montAtu  = mont;
        taxaAtu2 = t;
        t += 0.01;
      }
      taxaAnual  = (Math.pow(1 + taxaAtu2 / 100, 12) - 1) * 100;
      taxa       = taxaAtu2;
      investido  = inicial + recorrente * prazo;
      rendimentos = montAtu - investido;
      acumulado  = montAtu;
      renda      = acumulado * (taxa / 100);
      break;
    }
    case 4: { // Calcular renda de aposentadoria
      let rentAtual = inicial * (1 + taxa / 100) + recorrente;
      for (let i = 1; i < prazo; i++) {
        rentAtual = rentAtual * (1 + taxa / 100) + recorrente;
      }
      investido  = inicial + recorrente * prazo;
      rendimentos = rentAtual - investido;
      acumulado  = rentAtual;
      renda      = acumulado * (taxa / 100);
      break;
    }
  }

  if ([investido, rendimentos, acumulado, renda].some(v => v === Infinity || isNaN(v))) {
    alert(L.alertInvalid);
    return;
  }

  sessionStorage.setItem('chartData', JSON.stringify(gerarDadosGrafico(inicial, recorrente, taxa, prazo)));
  sessionStorage.setItem('prazo',               prazo ? calcularAnosEMeses(prazo) : 'N/A');
  sessionStorage.setItem('idadeAtualResult',    String(idadeAtualCalculada || 'N/A'));
  sessionStorage.setItem('idadeAposenResult',   String(idadeAposenCalculada || 'N/A'));
  sessionStorage.setItem('taxaResult',          taxa ? formatarValor(taxa.toFixed(4), false) : 'N/A');
  sessionStorage.setItem('taxaAnualResult',     taxaAnual ? formatarValor(taxaAnual.toFixed(2), false) : 'N/A');
  sessionStorage.setItem('valorInicialResult',  inicial ? formatarValor(inicial, false) : 'N/A');
  sessionStorage.setItem('valorRecorrenteResult', recorrente ? formatarValor(recorrente, false) : 'N/A');
  sessionStorage.setItem('valorInvestido',      investido ? formatarValor(investido, false) : 'N/A');
  sessionStorage.setItem('rendimentos',         rendimentos ? formatarValor(rendimentos, false) : 'N/A');
  sessionStorage.setItem('valorAcumulado',      acumulado ? formatarValor(acumulado, false) : 'N/A');
  sessionStorage.setItem('aposentadoriaResult', renda ? formatarValor(renda, false) : 'N/A');

  document.querySelector('.flip-card')?.classList.add('flip-card-flipped');
  setTimeout(() => { window.location.href = L.resultPage; }, 500);
}

function voltarFormulario(e) {
  e.preventDefault();
  document.querySelector('.flip-card')?.classList.remove('flip-card-flipped');
  setTimeout(() => { window.location.href = L.homePage; }, 500);
}

document.getElementById('calcularBtn')?.addEventListener('click', calcularAposentadoria);
document.getElementById('voltarBtn')?.addEventListener('click', voltarFormulario);

/* ===== RESULTADOS ===== */
const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'results.html' && !sessionStorage.getItem('aposentadoriaResult')) {
  window.location.href = L.homePage;
}

function setResult(id, label, value, prefix, suffix) {
  const el = document.getElementById(id);
  if (!el) return;
  const val = value && value !== 'N/A' ? `${prefix || ''}${value}${suffix || ''}` : '---';
  el.innerHTML = `<span>${label}</span><span>${val}</span>`;
}

const CUR = 'R$ ';
setResult('resultIdadeAtual',    L.idadeAtual,  sessionStorage.getItem('idadeAtualResult'),    '', ' anos');
setResult('resultIdadeAposen',   L.idadeAposen, sessionStorage.getItem('idadeAposenResult'),   '', ' anos');
setResult('resultPrazo',         L.prazo,       sessionStorage.getItem('prazo'));
setResult('resultValorInicial',  L.vi,          sessionStorage.getItem('valorInicialResult'),  CUR);
setResult('resultValorRecorrente', L.vr,        sessionStorage.getItem('valorRecorrenteResult'), CUR);
setResult('resultValorInvestido', L.invest,     sessionStorage.getItem('valorInvestido'),      CUR);
setResult('resultRendimentos',   L.rend,        sessionStorage.getItem('rendimentos'),         CUR);
setResult('resultValorAcumulado', L.acum,       sessionStorage.getItem('valorAcumulado'),      CUR);
setResult('resultTaxa',          L.taxa,        sessionStorage.getItem('taxaResult'),          '', ' %');
setResult('resultTaxaAnual',     L.taxaA,       sessionStorage.getItem('taxaAnualResult'),     '', ' %');
setResult('resultAposentadoria', L.renda,       sessionStorage.getItem('aposentadoriaResult'), CUR, '/mês');

// Destaca o campo calculado
const campoMap = ['resultPrazo', 'resultValorInicial', 'resultValorRecorrente', 'resultTaxa', 'resultAposentadoria'];
const campoCalculado = parseInt(sessionStorage.getItem('campoCalculado') ?? '-1');
if (campoCalculado >= 0 && campoCalculado < campoMap.length) {
  document.getElementById(campoMap[campoCalculado])?.classList.add('result-highlight');
}

/* ===== GRÁFICO ===== */
function renderizarGrafico() {
  const raw = sessionStorage.getItem('chartData');
  const canvas = document.getElementById('graficoPatrimonio');
  if (!raw || !canvas || typeof Chart === 'undefined') return;
  const pontos = JSON.parse(raw);
  if (pontos.length < 2) return;

  const cur = 'R$';
  const loc = 'pt-BR';

  const labels = pontos.map(p => {
    const anos = Math.floor(p.m / 12);
    return anos === 0 ? `${p.m}m` : `${anos}a`;
  });

  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: LANG === 'en' ? 'Accumulated Wealth' : 'Patrimônio Acumulado',
          data: pontos.map(p => p.acum),
          borderColor: '#e847eb',
          backgroundColor: 'rgba(232,71,235,0.12)',
          fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
        },
        {
          label: LANG === 'en' ? 'Total Invested' : 'Total Investido',
          data: pontos.map(p => p.invest),
          borderColor: '#7d38f0',
          backgroundColor: 'rgba(125,56,240,0.06)',
          fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#f8fafc', font: { family: 'Inter', size: 12 }, boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${cur} ${ctx.raw.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          },
          backgroundColor: '#1d193e', titleColor: '#f8fafc', bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
        }
      },
      scales: {
        x: { ticks: { color: '#94a3b8', maxTicksLimit: 8, font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: {
          ticks: {
            color: '#94a3b8', font: { size: 11 },
            callback: v => v >= 1e6 ? `${cur} ${(v/1e6).toFixed(1)}M` : v >= 1000 ? `${cur} ${(v/1000).toFixed(0)}k` : `${cur} ${v.toFixed(0)}`
          },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}

renderizarGrafico();

/* ===== CARD COMPARTILHÁVEL ===== */
function gerarCard() {
  const canvas = document.getElementById('cardCompartilhar');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 1080, H = 1350;
  canvas.width = W; canvas.height = H;
  const PX = 72;

  // Fundo
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#030711');
  bgGrad.addColorStop(1, '#130d2e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const g1 = ctx.createRadialGradient(W/2, 300, 0, W/2, 300, 420);
  g1.addColorStop(0, 'rgba(125,56,240,0.18)');
  g1.addColorStop(1, 'rgba(125,56,240,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W/2, H-200, 0, W/2, H-200, 380);
  g2.addColorStop(0, 'rgba(232,71,235,0.12)');
  g2.addColorStop(1, 'rgba(232,71,235,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, H-580, W, H);

  const mainGrad = ctx.createLinearGradient(0, 0, W, 0);
  mainGrad.addColorStop(0, '#7d38f0');
  mainGrad.addColorStop(1, '#e847eb');

  ctx.fillStyle = mainGrad; ctx.fillRect(0, 0, W, 14);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#7d38f0';
  ctx.font = '700 22px Inter, system-ui, sans-serif';
  ctx.fillText(LANG === 'en' ? 'Retirement Calculator' : 'Calculadora de Aposentadoria', W/2, 62);

  function div(y) {
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PX, y); ctx.lineTo(W-PX, y); ctx.stroke();
  }
  div(92);

  const idx    = parseInt(sessionStorage.getItem('campoCalculado') ?? '4');
  const prazo  = sessionStorage.getItem('prazo') || '---';
  const renda  = sessionStorage.getItem('aposentadoriaResult') || '---';
  const inic   = sessionStorage.getItem('valorInicialResult') || '---';
  const recorr = sessionStorage.getItem('valorRecorrenteResult') || '---';
  const taxa   = sessionStorage.getItem('taxaResult') || '---';
  const taxaA  = sessionStorage.getItem('taxaAnualResult') || '---';
  const acum   = sessionStorage.getItem('valorAcumulado') || '---';
  const invest = sessionStorage.getItem('valorInvestido') || '---';
  const rendim = sessionStorage.getItem('rendimentos') || '---';
  const idAtu  = sessionStorage.getItem('idadeAtualResult') || '---';
  const idApo  = sessionStorage.getItem('idadeAposenResult') || '---';

  const defs = LANG === 'en' ? [
    { pre: ['I will retire in'],                                big: prazo,             post: ['with $ ' + renda + '/month!'] },
    { pre: ['I only need'],                                     big: `$ ${inic}`,       post: ['as initial investment to retire', 'with $ ' + renda + '/month!'] },
    { pre: ['Investing only'],                                  big: `$ ${recorr}/mo`,  post: ['I will retire with $ ' + renda + '/month!'] },
    { pre: ['With only'],                                       big: `${taxa}% p.m.`,   post: ['monthly return I retire', 'with $ ' + renda + '/month!'] },
    { pre: ['My retirement income will be'],                    big: `$ ${renda}/mo`,   post: [] },
  ] : [
    { pre: ['Vou me aposentar em'],                             big: prazo,             post: ['com R$ ' + renda + '/mês!'] },
    { pre: ['Preciso de apenas'],                               big: `R$ ${inic}`,      post: ['de valor inicial para me aposentar', 'com R$ ' + renda + '/mês!'] },
    { pre: ['Investindo apenas'],                               big: `R$ ${recorr}/mês`, post: ['vou me aposentar com R$ ' + renda + '/mês!'] },
    { pre: ['Com apenas'],                                      big: `${taxa}% a.m.`,   post: ['de retorno vou me aposentar', 'com R$ ' + renda + '/mês!'] },
    { pre: ['Minha renda de aposentadoria será de'],            big: `R$ ${renda}/mês`, post: [] },
  ];
  const def = defs[idx >= 0 && idx < 5 ? idx : 4];

  const txtGrad = ctx.createLinearGradient(PX, 0, W-PX, 0);
  txtGrad.addColorStop(0, '#c084fc'); txtGrad.addColorStop(1, '#f0abfc');

  let y = 148;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 28px Inter, system-ui, sans-serif';
  for (const line of def.pre) { ctx.fillText(line, W/2, y); y += 44; }
  y += 60;

  let fs = 86;
  ctx.font = `800 ${fs}px Inter, system-ui, sans-serif`;
  while (ctx.measureText(def.big).width > W - PX*2 && fs > 38) {
    fs -= 2; ctx.font = `800 ${fs}px Inter, system-ui, sans-serif`;
  }
  ctx.fillStyle = txtGrad;
  ctx.fillText(def.big, W/2, y);
  y += 48;

  if (def.post.length) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 26px Inter, system-ui, sans-serif';
    for (const line of def.post) { ctx.fillText(line, W/2, y); y += 40; }
  }

  y += 56; div(y); y += 46;

  ctx.fillStyle = '#475569';
  ctx.font = '600 17px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(LANG === 'en' ? 'CALCULATION SUMMARY' : 'RESUMO DO CÁLCULO', PX, y);
  y += 18;

  const rows = LANG === 'en' ? [
    ['Current Age',            `${idAtu} years`],
    ['Retirement Age',         `${idApo} years`],
    ['Period',                 prazo],
    ['Initial Amount',         `$ ${inic}`],
    ['Monthly Contribution',   `$ ${recorr}`],
    ['Total Invested',         `$ ${invest}`],
    ['Returns',                `$ ${rendim}`],
    ['Accumulated Value',      `$ ${acum}`],
    ['Monthly Rate',           `${taxa}% p.m.`],
    ['Annual Rate',            `${taxaA}% p.a.`],
    ['Retirement Income',      `$ ${renda}/mo`],
  ] : [
    ['Idade Atual',            `${idAtu} anos`],
    ['Idade Aposentadoria',    `${idApo} anos`],
    ['Prazo',                  prazo],
    ['Valor Inicial',          `R$ ${inic}`],
    ['Aporte Mensal',          `R$ ${recorr}`],
    ['Total Investido',        `R$ ${invest}`],
    ['Rendimentos',            `R$ ${rendim}`],
    ['Valor Acumulado',        `R$ ${acum}`],
    ['Taxa Mensal',            `${taxa}% a.m.`],
    ['Taxa Anual',             `${taxaA}% a.a.`],
    ['Renda Aposentadoria',    `R$ ${renda}/mês`],
  ];

  for (const [label, val] of rows) {
    y += 56;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left'; ctx.fillText(label, PX, y);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right'; ctx.fillText(val, W-PX, y);
  }

  y += 50; div(y); y += 60;

  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 26px Inter, system-ui, sans-serif';
  ctx.fillText(LANG === 'en' ? 'Calculate yours too at:' : 'Calcule você também em:', W/2, y);
  y += 58;
  ctx.font = '700 36px Inter, system-ui, sans-serif';
  ctx.fillStyle = mainGrad;
  ctx.fillText(LANG === 'en' ? 'calcularaposentadoria.com' : 'calcularaposentadoria.com', W/2, y);
  y += 48;
  ctx.fillStyle = '#475569';
  ctx.font = '400 18px Inter, system-ui, sans-serif';
  ctx.fillText(LANG === 'en' ? 'Plan your retirement · Free' : 'Planeje sua aposentadoria · Grátis', W/2, y);

  ctx.fillStyle = mainGrad; ctx.fillRect(0, H-14, W, 14);
}

async function compartilharResultado() {
  const canvas = document.getElementById('cardCompartilhar');
  if (!canvas) return;

  const idx    = parseInt(sessionStorage.getItem('campoCalculado') ?? '4');
  const prazo  = sessionStorage.getItem('prazo') || '---';
  const renda  = sessionStorage.getItem('aposentadoriaResult') || '---';
  const inic   = sessionStorage.getItem('valorInicialResult') || '---';
  const recorr = sessionStorage.getItem('valorRecorrenteResult') || '---';
  const taxa   = sessionStorage.getItem('taxaResult') || '---';
  const url    = LANG === 'en' ? 'https://calcularaposentadoria.com/en/' : 'https://calcularaposentadoria.com';

  const frases = LANG === 'en' ? [
    `I will retire in ${prazo} with $ ${renda}/month! 🎯`,
    `I only need $ ${inic} as initial investment to retire with $ ${renda}/month! 🎯`,
    `Investing $ ${recorr}/month I will retire with $ ${renda}/month! 🎯`,
    `With ${taxa}% monthly return I will retire with $ ${renda}/month! 🎯`,
    `My retirement income will be $ ${renda}/month! 🎯`,
  ] : [
    `Vou me aposentar em ${prazo} com R$ ${renda}/mês! 🎯`,
    `Preciso de apenas R$ ${inic} para me aposentar com R$ ${renda}/mês! 🎯`,
    `Investindo R$ ${recorr}/mês vou me aposentar com R$ ${renda}/mês! 🎯`,
    `Com apenas ${taxa}% ao mês vou me aposentar com R$ ${renda}/mês! 🎯`,
    `Minha renda de aposentadoria será de R$ ${renda}/mês! 🎯`,
  ];
  const texto = frases[idx >= 0 && idx < 5 ? idx : 4];

  if (navigator.share) {
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'minha-aposentadoria.png', { type: 'image/png' });
      const shareData = (navigator.canShare && navigator.canShare({ files: [file] }))
        ? { files: [file], text: texto, url }
        : { text: `${texto}\n\nCalcule a sua: ${url}` };
      await navigator.share(shareData);
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
      try { await navigator.share({ text: `${texto}\n\nCalcule a sua: ${url}` }); return; } catch (_) {}
    }
  }

  // Fallback: download
  const link = document.createElement('a');
  link.download = 'minha-aposentadoria.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

if (document.getElementById('cardCompartilhar')) {
  document.fonts.ready.then(gerarCard);

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  const lbImg = document.createElement('img');
  lbImg.alt = LANG === 'en' ? 'Result full size' : 'Resultado em tamanho real';
  overlay.appendChild(lbImg);
  document.body.appendChild(overlay);

  document.getElementById('cardCompartilhar').addEventListener('click', function () {
    lbImg.src = this.toDataURL('image/png');
    overlay.classList.add('active');
  });
  overlay.addEventListener('click', () => overlay.classList.remove('active'));
}

/* ===== BACK TO TOP ===== */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.style.display = document.documentElement.scrollTop > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
