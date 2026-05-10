(function () {
  const path = window.location.pathname;
  const isEn = path.startsWith('/en');

  const PAIRS = {
    '/':    '/en/',
    '/en/': '/',
  };

  const title    = isEn ? 'Retirement Calculator'      : 'Calculadora de Aposentadoria';
  const subtitle = isEn
    ? 'Plan your retirement. Calculate how much to save and when to retire.'
    : 'Planeje sua aposentadoria. Calcule quanto poupar e quando se aposentar.';

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
      '<i class="fa-solid fa-umbrella-beach header-card-icon" aria-hidden="true"></i>' +
      '<div>' +
        '<span class="header-card-title">' + title + '</span>' +
        '<span class="header-card-subtitle">' + subtitle + '</span>' +
      '</div>' +
    '</div>' +
    langHtml;

  const script = document.currentScript;
  script.parentElement.insertBefore(card, script);
})();
