//// SCRIPT BOTÃO BACK TO TOP
// Exibe o botão quando o usuário rola para baixo
window.onscroll = function () {
  const backToTopButton = document.getElementById("backToTop");
  if (document.documentElement.scrollTop > 300) {
    // Mostrar após 300px de rolagem
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

// Função para rolar suavemente até o topo
document.getElementById("backToTop").onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
////----

//Compartilhar
document.getElementById("shareButton").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Calculadora de Renda Passiva",
        text: "A Calculadora de Renda Passiva foi desenvolvida para ajudar você a estimar quanto tempo falta para atingir sua renda passiva ideal e, ao mesmo tempo, simular diferentes cenários de investimento.",
        url: "https://calcularrendapassiva.com",
      });
      console.log("Compartilhamento bem-sucedido!");
    } catch (error) {
      console.log("Erro ao compartilhar:", error);
    }
  } else {
    alert(
      "A API de compartilhamento não é suportada neste navegador. Tente copiar os resultados e colar."
    );
  }
});

window.addEventListener("load", function () {
  // Pega o offsetHeight do tamanho atual do card da calculadora
  // e acrescenta a diferença como margin top do elemento abaixo.
  const flipcardfront = document.querySelector(".flip-card-front").offsetHeight;
  const botoesextras = document.querySelector(".botoes-extras");
  botoesextras.style.marginTop = flipcardfront - 400 + "px";
});

// Formatar máscaras dos valores (para campos de input com valores monetários e percentuais)
$(".value").mask("000.000.000,00", { reverse: true }); // Formata o valor monetário com pontuação e vírgula (ex: 1.000,00)
$(".percent").mask("00,00", { reverse: true }); // Formata o valor percentual com vírgula (ex: 10,00%)

// Recupera valores previamente salvos no sessionStorage e preenche os campos correspondentes
document.getElementById("idade_atual").value =
  sessionStorage.getItem("idade_atual") ?? "";

document.getElementById("idade_aposentadoria").value =
  sessionStorage.getItem("idade_aposentadoria") ?? "";

document.getElementById("txPeriodoAnual").value =
  sessionStorage.getItem("txPeriodoAnual") ?? "10,00";

document.getElementById("valorInicial").value =
  sessionStorage.getItem("valorInicial") ?? "";

document.getElementById("valorRecorrente").value =
  sessionStorage.getItem("valorRecorrente") ?? "";

document.getElementById("aposentadoria").value =
  sessionStorage.getItem("aposentadoria") ?? "";

// Limpar o Session Storage ao clicar no botão de reset
document.querySelector("#btn-reset").addEventListener("click", function () {
  sessionStorage.clear(); // Limpa todos os dados do sessionStorage
});

// Função de cálculo de Renda Passiva
function calcularRendaPassiva() {
  // Captura os valores inseridos pelo usuário
  const idade_atual = document.querySelector("#idade_atual").value;
  const idade_aposentadoria = document.querySelector(
    "#idade_aposentadoria"
  ).value;
  const periodoAnual = idade_aposentadoria - idade_atual;
  const periodo =
    idade_aposentadoria == "" ||
    idade_aposentadoria == 0 ||
    idade_atual == "" ||
    idade_atual == 0
      ? ""
      : Math.floor(periodoAnual * 12);
  const txPeriodoAnual = document.getElementById("txPeriodoAnual").value;
  const txPeriodo =
    txPeriodoAnual != ""
      ? (
          (Math.pow(
            1 + parseFloat(formatarValor(txPeriodoAnual)) / 100,
            1 / 12
          ) -
            1) *
          100
        )
          .toFixed(2)
          .replace(".", ",")
      : "";
  const valorInicial = document.getElementById("valorInicial").value;
  const valorRecorrente = document.getElementById("valorRecorrente").value;
  const rendaPassiva = document.getElementById("aposentadoria").value;

  // Salva os valores no sessionStorage para manter as informações na página
  sessionStorage.setItem("idade_atual", idade_atual);
  sessionStorage.setItem("idade_aposentadoria", idade_aposentadoria);
  sessionStorage.setItem("periodo", periodo);
  sessionStorage.setItem("periodoAnual", periodoAnual);
  sessionStorage.setItem("txPeriodo", txPeriodo);
  sessionStorage.setItem("txPeriodoAnual", txPeriodoAnual);
  sessionStorage.setItem("valorInicial", valorInicial);
  sessionStorage.setItem("valorRecorrente", valorRecorrente);
  sessionStorage.setItem("rendaPassiva", rendaPassiva);

  // Array que contém os campos preenchidos pelo usuário
  let camposPreenchidos = [
    periodo,
    valorInicial,
    valorRecorrente,
    txPeriodo,
    rendaPassiva,
  ];
  let totalCamposNPreenchidos = 0;
  let campoEmBranco = -1; // Variável para identificar o campo em branco

  // Verifica quais campos estão vazios
  camposPreenchidos.forEach((item, index) => {
    if (item === "") {
      totalCamposNPreenchidos++;
      campoEmBranco = index; // Guarda o índice do campo que está vazio
    }
  });

  // Se houver mais de um campo em branco, alerta o usuário
  if (totalCamposNPreenchidos !== 1) {
    alert("Deixe apenas um campo em branco para cálculo.");
    return;
  }

  // Função para formatar valores (de acordo com o sistema utilizado - true para formato internacional 1,000.00)
  function formatarValor(valor, sistema = true) {
    if (sistema) {
      return valor.replace(/\./g, "").replace(",", ".");
    } else {
      return valor
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }

  // Função para calcular o tempo em anos e meses
  function calcularAnosEMeses(totalMeses) {
    const anos = Math.floor(totalMeses / 12); // Calcula os anos inteiros
    const meses = totalMeses % 12; // Calcula os meses restantes

    const anoTexto = anos === 1 ? "1 ano" : `${anos} anos`; // Plural e singular para "ano"
    const mesTexto = meses === 1 ? "1 mês" : `${meses} meses`; // Plural e singular para "mês"

    // Se for menos de 1 ano, retorna apenas os meses
    if (anos === 0) {
      return mesTexto; // Retorna apenas meses
    }

    // Se os meses forem 0, retorna apenas os anos
    if (meses === 0) {
      // return `${totalMeses} meses (ou ${anoTexto})`; // Exemplo: "12 meses (ou 1 ano)"
      return `${anoTexto} (ou ${totalMeses} meses)`; // Exemplo: "1 ano (ou 12 meses)"
    }

    // Retorna no formato "X meses (ou X anos e X meses)"
    // return `${totalMeses} meses (ou ${anoTexto} e ${mesTexto})`; // Exemplo: "13 meses (ou 1 ano e 1 mês)"
    return `${anoTexto} e ${mesTexto} (ou ${totalMeses} meses)`; // Exemplo: "1 ano e 1 mês (ou 13 meses)"
  }

  // Conversão e cálculo dos valores
  let prazo = periodo ? periodo : 0,
    idadeAtualCalculada = idade_atual,
    idadeAposentadoriaCalculada = idade_aposentadoria,
    taxa = txPeriodo ? parseFloat(formatarValor(txPeriodo)) : 0,
    taxaAnual = txPeriodoAnual ? parseFloat(formatarValor(txPeriodoAnual)) : 0,
    inicial = valorInicial ? parseFloat(formatarValor(valorInicial)) : 0,
    recorrente = valorRecorrente
      ? parseFloat(formatarValor(valorRecorrente))
      : 0,
    renda = rendaPassiva ? parseFloat(formatarValor(rendaPassiva)) : 0;

  // Cálculo baseado no campo vazio identificado
  switch (campoEmBranco) {
    case 0: // Calcular o prazo
      vlrAtual = inicial;
      montante = renda / (taxa / 100);
      loop = 0;
      continuar = true;

      while (continuar) {
        if (vlrAtual * (1 + taxa / 100) + recorrente < montante) {
          vlrAtual = vlrAtual * (1 + taxa / 100) + recorrente;
        } else {
          continuar = false;
        }
        loop++;
      }

      prazo = loop - 1;
      idadeAtualCalculada =
        idade_atual == "" || idade_atual == 0
          ? parseFloat(idade_aposentadoria) - parseFloat(Math.floor(prazo / 12))
          : idade_atual;
      idadeAposentadoriaCalculada =
        idade_aposentadoria == "" || idade_aposentadoria == 0
          ? parseFloat(idade_atual) + parseFloat(Math.floor(prazo / 12))
          : idade_aposentadoria;
      investido = inicial + recorrente * prazo;
      rendimentos = vlrAtual - (inicial + recorrente * prazo);
      acumulado = vlrAtual;
      renda = acumulado * (taxa / 100);
      break;
    case 1: // Calcular o valor inicial
      montante = renda / (taxa / 100);
      taxaAtualizada = Math.pow(1 + taxa / 100, prazo);
      recorrenteAtualizado = recorrente * ((taxaAtualizada - 1) / (taxa / 100));
      inicialAtualizado = montante - recorrenteAtualizado;

      inicial = inicialAtualizado / taxaAtualizada;
      investido = inicial + recorrente * prazo;
      rendimentos = montante - (inicial + recorrente * prazo);
      acumulado = montante;
      renda = acumulado * (taxa / 100);
      break;
    case 2: // Calcular o valor recorrente
      montante = renda / (taxa / 100);
      inicialAtualizado = inicial * Math.pow(1 + taxa / 100, prazo);
      taxaAtualizada = (Math.pow(1 + taxa / 100, prazo) - 1) / (taxa / 100);

      recorrente = parseFloat(
        ((montante - inicialAtualizado) / taxaAtualizada).toFixed(2)
      );
      investido = inicial + recorrente * prazo;
      rendimentos = montante - (inicial + recorrente * prazo);
      acumulado = montante;
      renda = acumulado * (taxa / 100);
      break;
    case 3: // Calcular a taxa
      t = 0.01;
      r = 0;
      n = prazo;
      cont = true;
      montante = 0;
      montanteAtualizado = 0;
      rendaAtualizada = 0;
      taxaAtualizada = 0;

      while (cont) {
        investInicialAtualizado = inicial * Math.pow(1 + t / 100, n);
        investRecorrenteAtualizado =
          recorrente * ((Math.pow(1 + t / 100, n) - 1) / (t / 100));
        montante = investInicialAtualizado + investRecorrenteAtualizado;
        r = montante * (t / 100);
        if (r >= renda) {
          cont = false;
        } else {
          rendaAtualizada = r;
          montanteAtualizado = montante;
          taxaAtualizada = t;
          t = t + 0.01;
        }
      }

      let taxaAtualizadaAnual =
        (Math.pow(1 + taxaAtualizada / 100, 12) - 1) * 100;

      taxa = taxaAtualizada;
      taxaAnual = taxaAtualizadaAnual;
      investido = inicial + recorrente * prazo;
      rendimentos = montanteAtualizado - (inicial + recorrente * prazo);
      acumulado = montanteAtualizado;
      renda = acumulado * (taxa / 100);
      break;
    case 4: // Calcular a renda passiva
      rentAtual = inicial * (1 + taxa / 100) + recorrente;
      for (i = 1; i < prazo; i++) {
        rentAtual = rentAtual * (1 + taxa / 100) + recorrente;
      }

      investido = inicial + recorrente * prazo;
      rendimentos = rentAtual - investido;
      acumulado = rentAtual;
      renda = acumulado * (taxa / 100);
      break;
  }

  // Validações para evitar resultados infinitos
  if (
    investido == Infinity ||
    rendimentos == Infinity ||
    acumulado == Infinity ||
    renda == Infinity
  ) {
    alert(
      "Valores informados levam a resultados infinitos ou . Verifique os valores e tente novamente."
    );
    return false;
  }

  // Chama a função calcularAnosEMeses para formatar o prazo em anos e meses
  anosEMeses = calcularAnosEMeses(prazo);

  // Salva os resultados no sessionStorage
  sessionStorage.setItem("prazo", prazo ? anosEMeses : "N/A");
  sessionStorage.setItem(
    "idade_atual",
    idadeAtualCalculada ? idadeAtualCalculada : "N/A"
  );
  sessionStorage.setItem(
    "idade_aposentadoria",
    idadeAposentadoriaCalculada ? idadeAposentadoriaCalculada : "N/A"
  );
  sessionStorage.setItem(
    "valorInicial",
    inicial ? formatarValor(inicial, false) : "N/A"
  );
  sessionStorage.setItem(
    "valorRecorrente",
    recorrente ? formatarValor(recorrente, false) : "N/A"
  );
  sessionStorage.setItem(
    "valorInvestido",
    investido ? formatarValor(investido, false) : "N/A"
  );
  sessionStorage.setItem(
    "rendimentos",
    rendimentos ? formatarValor(rendimentos, false) : "N/A"
  );
  sessionStorage.setItem("taxa", taxa ? formatarValor(taxa, false) : "N/A");
  sessionStorage.setItem(
    "taxaAnual",
    taxaAnual ? formatarValor(taxaAnual, false) : "N/A"
  );
  sessionStorage.setItem(
    "aposentadoria",
    renda ? formatarValor(renda, false) : "N/A"
  );
  sessionStorage.setItem(
    "valorAcumulado",
    acumulado ? formatarValor(acumulado, false) : "N/A"
  );

  // Animação para "virar o cartão" e mostrar os resultados
  document.querySelector(".flip-card").classList.add("flip-card-flipped");

  // Redireciona para a página de resultados
  setTimeout(() => {
    window.location.href = "results.html";
  }, 500);
}

// Função para voltar ao formulário inicial
function voltarFormulario(e) {
  e.preventDefault(); // Previne o comportamento padrão do botão
  document.querySelector(".flip-card").classList.remove("flip-card-flipped"); // Reverte a animação do cartão
  setTimeout(() => {
    window.location.href = "index.html"; // Redireciona para a página inicial
  }, 500);
}

// Adiciona eventos aos botões de calcular e voltar
document
  .getElementById("calcularBtn")
  .addEventListener("click", calcularRendaPassiva);

if (document.getElementById("voltarBtn")) {
  document
    .getElementById("voltarBtn")
    .addEventListener("click", voltarFormulario);
}

// Verifica se a página de resultados está acessada diretamente sem cálculo
currentPage = window.location.pathname.split("/").pop(); // Pega a última parte da URL /index.html, /results.html etc.
if (currentPage == "results.html" && !sessionStorage.getItem("aposentadoria")) {
  window.location.href = "index.html"; // Redireciona para o início se não houver dados calculados
}

if (document.getElementById("resultPrazo")) {
  // Exibe os resultados na página de resultados

  document.getElementById(
    "resultPrazo"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Prazo:</span><span>${
    sessionStorage.getItem("prazo") || "---"
  }</span></p>`;

  document.getElementById(
    "resultIdadeAtual"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Idades (Atual / Aposentadoria):</span><span>${
    sessionStorage.getItem("idade_atual") || "---"
  } / ${sessionStorage.getItem("idade_aposentadoria") || "---"}</span></p>`;

  document.getElementById(
    "resultValorInicial"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Valor Inicial:</span><span>$ ${
    sessionStorage.getItem("valorInicial") || "---"
  }</span></p>`;

  document.getElementById(
    "resultValorRecorrente"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Valor Recorrente Mensal:</span><span>$ ${
    sessionStorage.getItem("valorRecorrente") || "---"
  }</span></p>`;

  document.getElementById(
    "resultValorInvestido"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Valor Investido:</span><span>$ ${
    sessionStorage.getItem("valorInvestido") || "---"
  }</span></p>`;

  document.getElementById(
    "resultRendimentos"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Rendimentos:</span><span>$ ${
    sessionStorage.getItem("rendimentos") || "---"
  }</span></p>`;

  document.getElementById(
    "resultTaxa"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Taxa Mensal:</span><span>${
    sessionStorage.getItem("taxa") || "---"
  } %</span></p>`;

  document.getElementById(
    "resultTaxaAnual"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Taxa Anual:</span><span>${
    sessionStorage.getItem("taxaAnual") || "---"
  } %</span></p>`;

  document.getElementById(
    "resultRendaPassiva"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Aposentadoria:</span><span>$ ${
    sessionStorage.getItem("aposentadoria") || "---"
  }</span></p>`;

  document.getElementById(
    "resultValorAcumulado"
  ).innerHTML = `<p class="d-flex justify-content-between border-bottom" style="border-color:#6c757d1a;"><span>Valor Acumulado:</span><span>$ ${
    sessionStorage.getItem("valorAcumulado") || "---"
  }</span></p>`;
}

if (document.getElementById("copiarBtn")) {
  // Função para copiar os resultados
  document.getElementById("copiarBtn").addEventListener("click", function () {
    const prazo = document.getElementById("resultPrazo").textContent;
    const idade_atual = document.getElementById("resultIdadeAtual").textContent;
    const idade_aposentadoria = document.getElementById(
      "resultIdadeAposentadoria"
    ).textContent;
    const valorInicial =
      document.getElementById("resultValorInicial").textContent;
    const valorRecorrente = document.getElementById(
      "resultValorRecorrente"
    ).textContent;
    const valorInvestido = document.getElementById(
      "resultValorInvestido"
    ).textContent;
    const valorRendimentos =
      document.getElementById("resultRendimentos").textContent;
    const taxa = document.getElementById("resultTaxa").textContent;
    const taxaAnual = document.getElementById("resultTaxaAnual").textContent;
    const rendaPassiva =
      document.getElementById("resultRendaPassiva").textContent;
    const valorAcumulado = document.getElementById(
      "resultValorAcumulado"
    ).textContent;

    // Formata o resultado para ser copiado
    const resultado = `Calcular Aposentadoria
https://www.calcularaposentadoria.com

Resultados
${prazo}
${idade_atual}
${idade_aposentadoria}
${valorInicial}
${valorRecorrente}
${valorInvestido}
${valorRendimentos}
${valorAcumulado}
${taxa}
${taxaAnual}
${rendaPassiva}
`;

    // Copia o texto para a área de transferência e alerta o usuário
    navigator.clipboard
      .writeText(resultado)
      .then(() => {
        alert("Resultados copiados para a área de transferência!");
      })
      .catch((err) => {
        alert("Erro ao copiar os resultados. Tente novamente.");
        console.error("Erro ao copiar", err);
      });
  });
}
