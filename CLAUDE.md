# calcularaposentadoria.com — Contexto do Projeto

## Regra crítica
**Nunca fazer commit ou push sem autorização explícita do usuário.** Após qualquer atualização, perguntar: "Quer que eu faça o commit (e push)?"

## O que é este projeto
Refatoração do site **calcularaposentadoria.com** — calculadora de aposentadoria em HTML+CSS+JS puro, hospedado na Vercel. O objetivo é aplicar o mesmo padrão visual, de UX e de SEO do projeto **calcularrendapassiva.com** (CRP), que foi refatorado com sucesso e recuperou tráfego após migração do Lovable/React para HTML estático.

## Referência: calcularrendapassiva.com (CRP)
O CRP é o projeto-irmão já concluído. Está em `c:\projetos\calcularrendapassiva`.
- Mesmo owner, mesmo stack (HTML+CSS+JS puro + Vercel)
- Mesmo design system (dark theme, cards, flip card, gráfico Chart.js)
- Mesmo padrão de UX: formulário com flip card, resultados, gráfico, artigos, email capture, doação
- Bilíngue PT/EN com `js/header-card.js` como componente de branding

**Sempre que tiver dúvida sobre padrão, estrutura ou CSS, consulte os arquivos do CRP em `c:\projetos\calcularrendapassiva`.**

## Status da refatoração
**Concluída.** Todos os arquivos legados foram substituídos ou arquivados.

## Estrutura de arquivos atual
```
index.html                          # PT — calculadora principal (refatorada)
results.html                        # PT — resultados com gráfico e sharing card
en/index.html                       # EN — calculadora
en/results.html                     # EN — resultados
termos-de-uso-e-politicas-de-privacidade.html  # PT — termos (refatorado)
en/terms.html                       # EN — terms and privacy policy
premium.html                        # redirect → / (legado arquivado)
artigos/
  como-usar-calculadora-aposentadoria.html
  o-que-e-aposentadoria.html
  quanto-preciso-para-me-aposentar.html
  entendendo-os-resultados.html
en/articles/
  how-to-use-retirement-calculator.html
  what-is-retirement.html
  how-much-do-i-need-to-retire.html
  understanding-the-results.html
css/style.css                       # design system (NÃO editar style.css da raiz)
js/calculadora.js                   # lógica principal (vanilla JS, bilíngue)
js/header-card.js                   # branding card (PT/EN automático)
js/email.js                         # captura de email Brevo
api/subscribe.js                    # Vercel Function — Brevo
sitemap.xml                         # 14 URLs com hreflang PT↔EN
robots.txt                          # Disallow results, Sitemap correto
vercel.json                         # redirect www→bare + cache
favicon.svg                         # ícone umbrella-beach com gradiente roxo→rosa
```

## Arquivos legados (NÃO usar)
- `script.js` — lógica legada jQuery (substituída por `js/calculadora.js`)
- `style.css` (raiz) — CSS legado Bootstrap (substituído por `css/style.css`)
- `jquery.mask.min.js` — dependência legada (não referenciada)

## Campos da calculadora de aposentadoria
O usuário preenche todos os campos e deixa **um em branco** — esse campo é calculado:
1. **Idade atual** — idade hoje
2. **Idade de aposentadoria** — quando quer se aposentar
3. **Taxa de juros anual (%)** — rendimento esperado
4. **Valor inicial** — patrimônio atual
5. **Aporte mensal** — quanto investe por mês
6. **Renda de aposentadoria** — renda mensal desejada na aposentadoria

O prazo em meses é derivado de `(idade aposentadoria - idade atual) × 12`.
IDs dos campos: `#idade_atual`, `#idade_aposentadoria`, `#txPeriodoAnual`, `#valorInicial`, `#valorRecorrente`, `#aposentadoria`.

## Códigos de rastreamento
- **GA4:** G-EN49D76J88 (específico deste projeto — diferente do CRP)
- **AdSense:** ca-pub-5865817649832793 (mesmo do CRP)
- **Vercel Analytics:** `/_vercel/insights/script.js`

## Links de doação (Stripe)
- **PT:** `https://donate.stripe.com/8x25kE16O5GEb1Y3Kkcwg04`
- **EN:** `https://donate.stripe.com/aFa4gA02K0mkfiedkUcwg03`

## Brevo — listas de email
- **PT:** lista 13 (`BREVO_LIST_ID=13`)
- **EN:** lista 14 (`BREVO_LIST_ID_EN=14`)

## SEO implementado
- `<h1 class="sr-only">` nas 4 páginas principais (index PT/EN + results PT/EN) — h1 visualmente oculto via `.sr-only`, semânticamente presente para o Google. Não usar `h1.card-title` pois quebra o layout do flex (h1 herda font-weight:bold e não shrinka).
- `hreflang` PT-BR / EN / x-default (x-default aponta para EN — público global)
- JSON-LD: `WebApplication` (com `potentialAction`) + `Organization` (com `sameAs`) em PT e EN
- `sitemap.xml` completo com 14 URLs e hreflang em cada entrada
- `robots.txt` exclui `/results.html` e `/en/results.html`
- AdSense bloqueado dentro de `.calculadora-container` via CSS (`display:none !important`)

## Stack e regras técnicas
- HTML + CSS + JS puros — zero frameworks, zero React, zero Bootstrap, zero jQuery
- Hospedagem: Vercel
- Usar apenas `css/style.css` — nunca `style.css` da raiz
- `sessionStorage` para passar dados entre `index.html` → `results.html`
- `document.currentScript` no `header-card.js` para injeção síncrona (sem FOUC)
- Detecção de idioma em `js/calculadora.js`: `LANG = path.startsWith('/en') ? 'en' : 'pt'`

## Padrão de novos artigos
Para cada novo artigo PT (`/artigos/`) ou EN (`/en/articles/`):
- `<script src="/js/header-card.js"></script>` dentro do `calculadora-container`
- Classes: `.article-back`, `.article-title`, `.article-meta`, `.article-content`, `.article-callout`, `.article-cta`, `.btn-article`
- Incluir `hreflang` PT↔EN e `x-default` no `<head>`
- Adicionar ao `sitemap.xml`
- Sem Bootstrap, sem CSS externo além de `css/style.css`

## Deploy
- Vercel (projeto: `calcular-aposentadoria`)
- Testar em URL provisória Vercel **antes** do swap de domínio
- Swap: configurar domínio no Vercel como Primary (não redirect para www) para evitar loop
