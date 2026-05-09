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

## Arquivos base já copiados do CRP
| Arquivo | O que é |
|---|---|
| `css/style.css` | Design system completo — NÃO usar `style.css` da raiz |
| `js/header-card.js` | Componente de branding (detecta idioma, injeta card, lang-switch automático) |
| `js/email.js` | Captura de email bilíngue com feedback visual |
| `api/subscribe.js` | Vercel Function para Brevo (listas PT=11, EN=12) |
| `vercel.json` | Redirect www→bare + cache headers |
| `robots.txt` | Exclui pages de resultado da indexação |

## Arquivos legados na raiz (analisar antes de descartar)
- `index.html` — home atual (lógica da calculadora a preservar)
- `results.html` — resultados atuais
- `script.js` — lógica JS atual (campos, cálculos, máscaras)
- `style.css` — CSS antigo (substituir pelo `css/style.css`)
- `jquery.mask.min.js` — dependência legada (substituir por vanilla JS)
- `premium.html` — verificar se tem tráfego antes de descartar
- `termos-de-uso-e-politicas-de-privacidade.html` — termos existentes

## Objetivo da refatoração
- Aplicar o design system do CRP (`css/style.css`)
- Substituir jQuery por vanilla JS (máscaras, lógica)
- Flip card animado: formulário → resultados
- Gráfico de evolução do patrimônio com Chart.js
- Card viral de compartilhamento (Canvas API)
- Seções: email capture (Brevo), doação (Stripe), artigos
- **Bilíngue PT + EN** (criar versão EN `/en/`)
- SEO: sitemap, hreflang, canonical, structured data, GA4, AdSense, Vercel Analytics

## Campos da calculadora de aposentadoria
O usuário preenche todos os campos e deixa **um em branco** — esse campo é calculado:
1. **Idade atual** — idade hoje
2. **Idade de aposentadoria** — quando quer se aposentar
3. **Taxa de juros mensal (%)** — rendimento esperado
4. **Valor inicial** — patrimônio atual
5. **Aporte mensal** — quanto investe por mês
6. **Renda de aposentadoria** — renda mensal desejada na aposentadoria

O prazo em meses é derivado de `(idade aposentadoria - idade atual) × 12`.

## Códigos de rastreamento
- **GA4:** G-V1JD0D4KM1 (mesmo do CRP — confirmar com o usuário se é o mesmo)
- **AdSense:** ca-pub-5865817649832793 (mesmo do CRP — confirmar)
- **Vercel Analytics:** `/_vercel/insights/script.js`

## Stack e regras técnicas
- HTML + CSS + JS puros — zero frameworks, zero React, zero Bootstrap, zero jQuery
- Hospedagem: Vercel
- Sem `style.css` na raiz — usar apenas `css/style.css`
- Sem `script.js` legado — reescrever em `js/calculadora.js`
- `sessionStorage` para passar dados entre `index.html` → `results.html`
- `document.currentScript` no `header-card.js` para injeção síncrona (sem FOUC)

## Padrão de novos artigos
Para cada novo artigo PT ou EN, usar o template de artigo do CRP:
- `<script src="/js/header-card.js"></script>` dentro do `calculadora-container`
- Classes: `.article-back`, `.article-title`, `.article-meta`, `.article-content`, `.article-callout`, `.article-cta`, `.btn-article`
- Sem Bootstrap, sem CSS externo além de `css/style.css`

## Deploy
- Vercel (projeto novo ou existente — verificar com o usuário)
- Testar em URL provisória Vercel **antes** do swap de domínio
- Swap: configurar domínio no Vercel como Primary (não redirect para www) para evitar loop
