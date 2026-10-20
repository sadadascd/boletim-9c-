/* =========================================================
   BOLETIM DIGITAL - script.js
   Dados do 9º Ano (Turma 9C, Chamada 10)
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURAÇÃO FIXA DO ALUNO
   --------------------------------------------------------- */
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 10,
  apiUrl: "https://boletim-api.profbt.com.br"
};

const MEDIA_MINIMA = 6.0;
const FREQUENCIA_DEMONSTRATIVA = 92;

/* ---------------------------------------------------------
   SESSÃO EM MEMÓRIA DO PIN E DADOS
   --------------------------------------------------------- */
let pinSessao = null;
let listaDisciplinasAtual = [];

/* ---------------------------------------------------------
   1) DADOS BRUTOS LOCAIS (FALLBACK)
   --------------------------------------------------------- */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

/* ---------------------------------------------------------
   FUNÇÕES DE NORMALIZAÇÃO E TRATAMENTO
   --------------------------------------------------------- */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }
  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });
  if (validas.length === 0) {
    return null;
  }
  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });
  return soma / validas.length;
}

function somarFaltas(listaFaltas) {
  if (!Array.isArray(listaFaltas)) return 0;
  let total = 0;
  listaFaltas.forEach(function (f) {
    total += Number(f) || 0;
  });
  return total;
}

function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

function formatarNota(numero) {
  if (numero === null) {
    return "—";
  }
  return numero.toFixed(1).replace(".", ",");
}

function criarClasseSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

/* ---------------------------------------------------------
   RENDERIZAÇÃO DA TELA
   --------------------------------------------------------- */
function renderizarTela(disciplinas) {
  listaDisciplinasAtual = disciplinas;

  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  const disciplinasTratadas = disciplinas.map(function (d) {
    const n1 = normalizarNota(d.tri1);
    const n2 = normalizarNota(d.tri2);
    const n3 = normalizarNota(d.tri3);

    const media = calcularMedia([n1, n2, n3]);
    let totalF = 0;
    if (Array.isArray(d.faltas)) {
      totalF = somarFaltas(d.faltas);
    } else if (typeof d.faltas === "number") {
      totalF = d.faltas;
    }

    const situacao = definirSituacao(media);

    return {
      disciplina: d.disciplina,
      tri1: n1,
      tri2: n2,
      tri3: n3,
      media: media,
      faltas: totalF,
      situacao: situacao
    };
  });

  disciplinasTratadas.forEach(function (d) {
    const linha = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = d.disciplina;
    linha.appendChild(tdNome);

    const td1 = document.createElement("td");
    td1.textContent = formatarNota(d.tri1);
    linha.appendChild(td1);

    const td2 = document.createElement("td");
    td2.textContent = formatarNota(d.tri2);
    linha.appendChild(td2);

    const td3 = document.createElement("td");
    td3.textContent = formatarNota(d.tri3);
    linha.appendChild(td3);

    const tdMedia = document.createElement("td");
    tdMedia.textContent = formatarNota(d.media);
    linha.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = d.faltas;
    linha.appendChild(tdFaltas);

    const tdSit = document.createElement("td");
    tdSit.textContent = d.situacao;
    tdSit.className = criarClasseSituacao(d.situacao);
    linha.appendChild(tdSit);

    corpoTabela.appendChild(linha);
  });

  const mediasDisponiveis = disciplinasTratadas
    .map(function (d) { return d.media; })
    .filter(function (m) { return m !== null; });

  let mediaGeral = null;
  if (mediasDisponiveis.length > 0) {
    let soma = 0;
    mediasDisponiveis.forEach(function (m) { soma += m; });
    mediaGeral = soma / mediasDisponiveis.length;
  }

  document.getElementById("media-geral").textContent = formatarNota(mediaGeral);

  let totalFaltasGeral = 0;
  disciplinasTratadas.forEach(function (d) {
    totalFaltasGeral += d.faltas;
  });
  document.getElementById("total-faltas").textContent = totalFaltasGeral;

  let qtdBom = 0;
  disciplinasTratadas.forEach(function (d) {
    if (d.situacao === "Bom desempenho") qtdBom++;
  });
  document.getElementById("qtd-bom").textContent = qtdBom;

  let qtdAtencao = 0;
  disciplinasTratadas.forEach(function (d) {
    if (d.situacao === "Atenção") qtdAtencao++;
  });
  document.getElementById("qtd-atencao").textContent = qtdAtencao;

  document.getElementById("frequencia").textContent = FREQUENCIA_DEMONSTRATIVA + "%";
  document.getElementById("frequencia-legenda").textContent = "Frequência adequada";
}

/* ---------------------------------------------------------
   CONEXÃO API: ABRIR BOLETIM
   --------------------------------------------------------- */
document.getElementById("btn-entrar").addEventListener("click", function () {
  const campoPin = document.getElementById("input-pin");
  const pinDigitado = campoPin.value.trim();
  const msgLogin = document.getElementById("msg-login");

  if (!pinDigitado) {
    msgLogin.textContent = "Por favor, digite o PIN.";
    return;
  }

  msgLogin.textContent = "Conectando...";

  fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinDigitado
    })
  })
    .then(function (res) {
      if (res.status === 401) {
        throw new Error("Turma, chamada ou PIN inválidos.");
      }
      if (res.status === 429) {
        throw new Error("Muitas tentativas. Aguarde um minuto e tente novamente.");
      }
      if (!res.ok) {
        throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
      }
      return res.json();
    })
    .then(function (data) {
      pinSessao = pinDigitado;
      campoPin.value = "";
      msgLogin.textContent = "";

      document.getElementById("area-login").classList.add("escondido");
      document.getElementById("conteudo-boletim").classList.remove("escondido");

      let disciplinasParaUsar = [];

      if (data && data.dados && Array.isArray(data.dados.disciplinas) && data.dados.disciplinas.length > 0) {
        disciplinasParaUsar = data.dados.disciplinas;
      } else {
        disciplinasParaUsar = dadosBrutos;
      }

      renderizarTela(disciplinasParaUsar);
    })
    .catch(function (err) {
      msgLogin.textContent = err.message || "Não foi possível conectar ao servidor. Tente novamente.";
    });
});

/* ---------------------------------------------------------
   EDIÇÃO DE DADOS
   --------------------------------------------------------- */
document.getElementById("btn-alterar").addEventListener("click", function () {
  const painel = document.getElementById("painel-edicao");
  const container = document.getElementById("container-campos-edicao");
  container.innerHTML = "";

  listaDisciplinasAtual.forEach(function (d, idx) {
    const block = document.createElement("div");
    block.className = "grid-edicao-disciplina";

    const h3 = document.createElement("h3");
    h3.textContent = d.disciplina;
    block.appendChild(h3);

    const grid = document.createElement("div");
    grid.className = "campos-grid";

    let f1 = "", f2 = "", f3 = "";
    if (Array.isArray(d.faltas)) {
      f1 = d.faltas[0] !== undefined && d.faltas[0] !== null ? d.faltas[0] : "";
      f2 = d.faltas[1] !== undefined && d.faltas[1] !== null ? d.faltas[1] : "";
      f3 = d.faltas[2] !== undefined && d.faltas[2] !== null ? d.faltas[2] : "";
    } else if (typeof d.faltas === "number") {
      f1 = d.faltas;
    }

    const val1 = d.tri1 !== null && d.tri1 !== undefined ? String(d.tri1).replace(".", ",") : "";
    const val2 = d.tri2 !== null && d.tri2 !== undefined ? String(d.tri2).replace(".", ",") : "";
    const val3 = d.tri3 !== null && d.tri3 !== undefined ? String(d.tri3).replace(".", ",") : "";

    grid.innerHTML =
      '<div class="item-campo"><label>1º Tri Nota</label><input type="text" class="inp-nota" data-idx="' + idx + '" data-campo="tri1" value="' + val1 + '" placeholder="ex: 7,5"></div>' +
      '<div class="item-campo"><label>2º Tri Nota</label><input type="text" class="inp-nota" data-idx="' + idx + '" data-campo="tri2" value="' + val2 + '" placeholder="ex: 8,0"></div>' +
      '<div class="item-campo"><label>3º Tri Nota</label><input type="text" class="inp-nota" data-idx="' + idx + '" data-campo="tri3" value="' + val3 + '" placeholder="ex: 9,2"></div>' +
      '<div class="item-campo"><label>1º Tri Faltas</label><input type="text" class="inp-falta" data-idx="' + idx + '" data-campo="f1" value="' + f1 + '"></div>' +
      '<div class="item-campo"><label>2º Tri Faltas</label><input type="text" class="inp-falta" data-idx="' + idx + '" data-campo="f2" value="' + f2 + '"></div>' +
      '<div class="item-campo"><label>3º Tri Faltas</label><input type="text" class="inp-falta" data-idx="' + idx + '" data-campo="f3" value="' + f3 + '"></div>';

    block.appendChild(grid);
    container.appendChild(block);
  });

  painel.classList.remove("escondido");
});

document.getElementById("btn-cancelar").addEventListener("click", function () {
  document.getElementById("painel-edicao").classList.add("escondido");
  document.getElementById("msg-edicao").textContent = "";
});

function validarNotaInput(val) {
  if (val === "" || val === null || val === undefined) return { ok: true, valor: null };
  const str = String(val).trim().replace(",", ".");
  if (str === "") return { ok: true, valor: null };
  const num = Number(str);
  if (isNaN(num) || num < 0 || num > 10) return { ok: false };
  return { ok: true, valor: num };
}

function validarFaltaInput(val) {
  if (val === "" || val === null || val === undefined) return { ok: false };
  const str = String(val).trim();
  if (!/^\d+$/.test(str)) return { ok: false };
  const num = parseInt(str, 10);
  if (isNaN(num) || num < 0) return { ok: false };
  return { ok: true, valor: num };
}

/* ---------------------------------------------------------
   SALVAR ALTERAÇÕES NA API
   --------------------------------------------------------- */
document.getElementById("btn-salvar").addEventListener("click", function () {
  const msgEdicao = document.getElementById("msg-edicao");
  msgEdicao.textContent = "";

  const inputs = document.querySelectorAll("#container-campos-edicao input");
  inputs.forEach(function (inp) { inp.classList.remove("campo-invalido"); });

  let possuiErro = false;
  const copiaDisciplinas = JSON.parse(JSON.stringify(listaDisciplinasAtual));

  inputs.forEach(function (inp) {
    const idx = parseInt(inp.getAttribute("data-idx"), 10);
    const campo = inp.getAttribute("data-campo");
    const valRaw = inp.value;

    if (inp.classList.contains("inp-nota")) {
      const res = validarNotaInput(valRaw);
      if (!res.ok) {
        inp.classList.add("campo-invalido");
        possuiErro = true;
      } else {
        copiaDisciplinas[idx][campo] = res.valor;
      }
    } else if (inp.classList.contains("inp-falta")) {
      const res = validarFaltaInput(valRaw);
      if (!res.ok) {
        inp.classList.add("campo-invalido");
        possuiErro = true;
      } else {
        if (!Array.isArray(copiaDisciplinas[idx].faltas)) {
          copiaDisciplinas[idx].faltas = [0, 0, 0];
        }
        if (campo === "f1") copiaDisciplinas[idx].faltas[0] = res.valor;
        if (campo === "f2") copiaDisciplinas[idx].faltas[1] = res.valor;
        if (campo === "f3") copiaDisciplinas[idx].faltas[2] = res.valor;
      }
    }
  });

  if (possuiErro) {
    msgEdicao.textContent = "Existem campos com valores inválidos. Verifique os destaques em vermelho.";
    return;
  }

  msgEdicao.textContent = "Salvando...";

  fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinSessao,
      dados: {
        disciplinas: copiaDisciplinas
      }
    })
  })
    .then(function (res) {
      if (!res.ok) {
        throw new Error("Erro ao salvar os dados no servidor.");
      }
      return res.json();
    })
    .then(function () {
      msgEdicao.textContent = "Dados salvos com sucesso.";
      renderizarTela(copiaDisciplinas);
      setTimeout(function () {
        document.getElementById("painel-edicao").classList.add("escondido");
        msgEdicao.textContent = "";
      }, 1500);
    })
    .catch(function (err) {
      msgEdicao.textContent = err.message || "Não foi possível salvar as alterações. Mantenha os dados e tente novamente.";
    });
});er