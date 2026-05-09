(function () {
  const path = window.location.pathname;
  const isEn = path.startsWith('/en');

  // Bilingual pairs: current path → alternate language URL
  const PAIRS = {
    '/':    '/en/',
    '/en/': '/',
    '/articles/o-que-e-renda-passiva.html':          '/en/articles/what-is-passive-income.html',
    '/articles/como-usar-calculadora-renda-passiva.html': '/en/articles/how-to-use-passive-income-calculator.html',
    '/en/articles/what-is-passive-income.html':          '/articles/o-que-e-renda-passiva.html',
    '/en/articles/how-to-use-passive-income-calculator.html': '/articles/como-usar-calculadora-renda-passiva.html',
  };

  const title    = isEn ? 'Passive Income Calculator'      : 'Calculadora de Renda Passiva';
  const subtitle = isEn
    ? 'Discover how much to invest to live off passive income.'
    : 'Descubra quanto investir para viver de renda.';

  const altUrl = PAIRS[path] || null;

  let langHtml = '';
  if (altUrl) {
    langHtml = isEn
      ? `<div class="lang-switch"><i class="fa-solid fa-globe" aria-hidden="true"></i><a href="${altUrl}" class="lang-link">PT</a><span class="lang-sep">|</span><span class="lang-active">EN</span></div>`
      : `<div class="lang-switch"><i class="fa-solid fa-globe" aria-hidden="true"></i><span class="lang-active">PT</span><span class="lang-sep">|</span><a href="${altUrl}" class="lang-link">EN</a></div>`;
  }

  const card = document.createElement('div');
  card.className = 'card header-card';
  card.innerHTML =
    '<div class="header-card-brand">' +
      '<i class="fa-solid fa-calculator header-card-icon" aria-hidden="true"></i>' +
      '<div>' +
        '<span class="header-card-title">' + title + '</span>' +
        '<span class="header-card-subtitle">' + subtitle + '</span>' +
      '</div>' +
    '</div>' +
    langHtml;

  const script = document.currentScript;
  script.parentElement.insertBefore(card, script);
})();
