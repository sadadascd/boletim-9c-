/* =========================================================
   BOLETIM DIGITAL - script.js
   Dados fictícios do 9º Ano - Estudante Exemplo
   ========================================================= */

/* ---------------------------------------------------------
   1) DADOS BRUTOS
   Array (lista) de objetos (cada disciplina é um objeto).
   As notas podem vir como número (78) ou string ("8,2").
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
   2) CONSTANTES DO PROJETO
   --------------------------------------------------------- */
const MEDIA_MINIMA = 6.0;

// ⚠️ ATENÇÃO: frequência FICTÍCIA apenas para demonstração.
// No futuro, será calculada de outra forma (não a partir das faltas).
const FREQUENCIA_DEMONSTRATIVA = 92;

/* ---------------------------------------------------------
   3) FUNÇÃO: normalizarNota(valor)
   Converte qualquer nota bruta para a escala 0–10.
   Regras:
   - vazio / null / undefined → null (nota ainda não lançada)
   - 0 a 10 → mantém
   - > 10 e <= 100 → divide por 10
   - aceita ponto ou vírgula decimal
   - fora das regras → null (inválida)
   --------------------------------------------------------- */
function normalizarNota(valor) {
  // Se estiver vazio, nulo ou indefinido → sem nota
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for string, troca vírgula por ponto antes de converter
  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  // Se não for número válido → inválida
  if (isNaN(numero)) {
    return null;
  }

  // Regras de escala
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras → inválida
  return null;
}

/* ---------------------------------------------------------
   4) FUNÇÃO: calcularMedia(notas)
   Recebe um array de notas (já normalizadas, podendo ter null).
   Usa SOMENTE as notas válidas. Nunca transforma ausente em 0.
   Retorna null se não houver nenhuma nota válida.
   --------------------------------------------------------- */
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) {
    return null;
  }

  // Soma todas as notas válidas
  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });

  return soma / validas.length;
}

/* ---------------------------------------------------------
   5) FUNÇÃO: somarFaltas(listaFaltas)
   Soma os números inteiros das faltas dos trimestres.
   --------------------------------------------------------- */
function somarFaltas(listaFaltas) {
  let total = 0;
  listaFaltas.forEach(function (f) {
    total += Number(f) || 0;
  });
  return total;
}

/* ---------------------------------------------------------
   6) FUNÇÃO: definirSituacao(media)
   Retorna o texto de situação conforme a média.
   --------------------------------------------------------- */
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

/* ---------------------------------------------------------
   7) FUNÇÃO: formatarNota(numero)
   Mostra a nota com 1 casa decimal ou "—" se for null.
   --------------------------------------------------------- */
function formatarNota(numero) {
  if (numero === null) {
    return "—";
  }
  return numero.toFixed(1).replace(".", ",");
}

/* ---------------------------------------------------------
   8) FUNÇÃO: criarClasseSituacao(situacao)
   Retorna a classe CSS correspondente à situação.
   --------------------------------------------------------- */
function criarClasseSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

/* ---------------------------------------------------------
   9) MONTAR DADOS TRATADOS
   Percorre o array de dados brutos e cria um novo array
   com notas já normalizadas, média e situação.
   --------------------------------------------------------- */
const disciplinasTratadas = dadosBrutos.map(function (d) {
  const n1 = normalizarNota(d.tri1);
  const n2 = normalizarNota(d.tri2);
  const n3 = normalizarNota(d.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = somarFaltas(d.faltas);
  const situacao = definirSituacao(media);

  return {
    disciplina: d.disciplina,
    tri1: n1,
    tri2: n2,
    tri3: n3,
    media: media,
    faltas: totalFaltas,
    situacao: situacao
  };
});

/* ---------------------------------------------------------
   10) PREENCHER A TABELA (usando o DOM)
   Cada objeto gera uma linha <tr> na tabela.
   --------------------------------------------------------- */
const corpoTabela = document.getElementById("corpo-tabela");

disciplinasTratadas.forEach(function (d) {
  const linha = document.createElement("tr");

  linha.innerHTML =
    "<td>" + d.disciplina + "</td>" +
    "<td>" + formatarNota(d.tri1) + "</td>" +
    "<td>" + formatarNota(d.tri2) + "</td>" +
    "<td>" + formatarNota(d.tri3) + "</td>" +
    "<td>" + formatarNota(d.media) + "</td>" +
    "<td>" + d.faltas + "</td>" +
    "<td class='" + criarClasseSituacao(d.situacao) + "'>" + d.situacao + "</td>";

  corpoTabela.appendChild(linha);
});

/* ---------------------------------------------------------
   11) CALCULAR E EXIBIR OS CARDS DE RESUMO
   --------------------------------------------------------- */

// ----- Média Geral (média de todas as médias disponíveis) -----
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

// ----- Total de Faltas (soma de todas as disciplinas) -----
let totalFaltasGeral = 0;
disciplinasTratadas.forEach(function (d) {
  totalFaltasGeral += d.faltas;
});
document.getElementById("total-faltas").textContent = totalFaltasGeral;

// ----- Quantidade com Bom Desempenho -----
let qtdBom = 0;
disciplinasTratadas.forEach(function (d) {
  if (d.situacao === "Bom desempenho") qtdBom++;
});
document.getElementById("qtd-bom").textContent = qtdBom;

// ----- Quantidade que Precisam de Atenção -----
let qtdAtencao = 0;
disciplinasTratadas.forEach(function (d) {
  if (d.situacao === "Atenção") qtdAtencao++;
});
document.getElementById("qtd-atencao").textContent = qtdAtencao;

// ----- Frequência (apenas demonstrativa) -----
document.getElementById("frequencia").textContent = FREQUENCIA_DEMONSTRATIVA + "%";
document.getElementById("frequencia-legenda").textContent = "Frequência adequada";