export interface DiagnosticQuestion {
  id: string;
  category: string;
  question: string;
  type: "select" | "radio" | "text" | "number";
  options?: { value: string; label: string; score?: number }[];
  required?: boolean;
  showIf?: (answers: Record<string, any>) => boolean;
  scoreWeight?: number;
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "tipo_entidade",
    category: "Dados da Empresa",
    question: "Qual é o tipo da sua entidade?",
    type: "radio",
    options: [
      { value: "empresa_individual", label: "Empresa Individual", score: 0 },
      { value: "sociedade_limitada", label: "Sociedade por Quotas (Lda)", score: 0 },
      { value: "sociedade_anonima", label: "Sociedade Anónima (SA)", score: 0 },
      { value: "associacao", label: "Associação / ONG", score: 0 },
      { value: "outro", label: "Outro", score: 0 },
    ],
    required: true,
  },
  {
    id: "sector_actividade",
    category: "Dados da Empresa",
    question: "Qual é o sector de actividade principal?",
    type: "select",
    options: [
      { value: "comercio", label: "Comércio" },
      { value: "servicos", label: "Prestação de Serviços" },
      { value: "industria", label: "Indústria" },
      { value: "agricultura", label: "Agricultura" },
      { value: "construcao", label: "Construção" },
      { value: "turismo", label: "Turismo e Hotelaria" },
      { value: "tecnologia", label: "Tecnologia" },
      { value: "outro", label: "Outro" },
    ],
    required: true,
  },
  {
    id: "volume_negocios",
    category: "Dados da Empresa",
    question: "Qual é o volume de negócios anual estimado (em MZN)?",
    type: "radio",
    options: [
      { value: "ate_2500000", label: "Até 2.500.000 MT", score: 5 },
      { value: "2500001_36000000", label: "2.500.001 - 36.000.000 MT", score: 0 },
      { value: "acima_36000000", label: "Acima de 36.000.000 MT", score: 0 },
    ],
    required: true,
    scoreWeight: 2,
  },
  {
    id: "num_colaboradores",
    category: "Dados da Empresa",
    question: "Quantos colaboradores tem a empresa?",
    type: "radio",
    options: [
      { value: "0", label: "Nenhum (trabalhador independente)", score: 5 },
      { value: "1_10", label: "1 a 10", score: 3 },
      { value: "11_50", label: "11 a 50", score: 0 },
      { value: "mais_50", label: "Mais de 50", score: 0 },
    ],
    required: true,
  },
  {
    id: "tem_nuit",
    category: "Situação NUIT",
    question: "A empresa possui NUIT (Número Único de Identificação Tributária)?",
    type: "radio",
    options: [
      { value: "sim", label: "Sim", score: 0 },
      { value: "nao", label: "Não", score: -20 },
      { value: "em_processo", label: "Em processo de obtenção", score: -10 },
    ],
    required: true,
    scoreWeight: 3,
  },
  {
    id: "nuit_actualizado",
    category: "Situação NUIT",
    question: "Os dados do NUIT estão actualizados (endereço, actividade, etc)?",
    type: "radio",
    options: [
      { value: "sim", label: "Sim, tudo actualizado", score: 5 },
      { value: "nao_sei", label: "Não tenho certeza", score: -5 },
      { value: "nao", label: "Não, há dados desactualizados", score: -10 },
    ],
    showIf: (a) => a.tem_nuit === "sim",
  },
  {
    id: "regime_fiscal",
    category: "Regime Fiscal",
    question: "Em que regime fiscal a empresa está enquadrada?",
    type: "radio",
    options: [
      { value: "ispc", label: "ISPC (Imposto Simplificado)", score: 3 },
      { value: "regime_normal", label: "Regime Normal (IVA + IRPC)", score: 0 },
      { value: "nao_sei", label: "Não sei", score: -15 },
    ],
    required: true,
    scoreWeight: 2,
  },
  {
    id: "regime_correcto",
    category: "Regime Fiscal",
    question: "Acredita que está no regime fiscal correcto para o seu volume de negócios?",
    type: "radio",
    options: [
      { value: "sim", label: "Sim", score: 5 },
      { value: "nao", label: "Não", score: -10 },
      { value: "nao_sei", label: "Não sei", score: -5 },
    ],
  },
  {
    id: "registado_iva",
    category: "IVA",
    question: "A empresa está registada para efeitos de IVA?",
    type: "radio",
    options: [
      { value: "sim", label: "Sim", score: 5 },
      { value: "nao", label: "Não", score: 0 },
      { value: "nao_sei", label: "Não sei", score: -10 },
    ],
    showIf: (a) => a.regime_fiscal !== "ispc",
    scoreWeight: 2,
  },
  {
    id: "declaracao_iva_mensal",
    category: "IVA",
    question: "Entrega a Declaração Periódica de IVA mensalmente?",
    type: "radio",
    options: [
      { value: "sim_sempre", label: "Sim, sempre em dia", score: 10 },
      { value: "sim_atrasos", label: "Sim, mas com atrasos", score: -5 },
      { value: "nao", label: "Não entrego", score: -20 },
      { value: "nao_aplicavel", label: "Não se aplica", score: 0 },
    ],
    showIf: (a) => a.registado_iva === "sim",
    scoreWeight: 3,
  },
  {
    id: "contabilidade_organizada",
    category: "Obrigações Declarativas",
    question: "A empresa tem contabilidade organizada?",
    type: "radio",
    options: [
      { value: "sim", label: "Sim, com contabilista certificado", score: 10 },
      { value: "sim_informal", label: "Sim, mas informal", score: -5 },
      { value: "nao", label: "Não", score: -15 },
    ],
    required: true,
    scoreWeight: 2,
  },
  {
    id: "dividas_fiscais",
    category: "Dívidas Fiscais",
    question: "A empresa tem dívidas fiscais pendentes?",
    type: "radio",
    options: [
      { value: "nao", label: "Não", score: 10 },
      { value: "sim_pequenas", label: "Sim, valores pequenos", score: -5 },
      { value: "sim_grandes", label: "Sim, valores significativos", score: -20 },
      { value: "nao_sei", label: "Não sei", score: -10 },
    ],
    required: true,
    scoreWeight: 3,
  },
  {
    id: "multas_anteriores",
    category: "Dívidas Fiscais",
    question: "Já recebeu multas ou notificações da Autoridade Tributária?",
    type: "radio",
    options: [
      { value: "nao", label: "Nunca", score: 5 },
      { value: "sim_resolvidas", label: "Sim, mas já resolvidas", score: 0 },
      { value: "sim_pendentes", label: "Sim, ainda pendentes", score: -15 },
    ],
    scoreWeight: 2,
  },
];

export function calculateDiagnosticScore(answers: Record<string, any>): {
  score: number;
  riskLevel: string;
  recommendations: string[];
} {
  let totalScore = 70;
  const recommendations: string[] = [];

  diagnosticQuestions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;
    const option = q.options?.find((o) => o.value === answer);
    if (!option || option.score === undefined) return;
    const weight = q.scoreWeight || 1;
    totalScore += option.score * weight;
  });

  totalScore = Math.max(0, Math.min(100, totalScore));

  if (answers.tem_nuit === "nao") recommendations.push("Obter NUIT junto da Autoridade Tributária é prioritário.");
  if (answers.regime_fiscal === "nao_sei") recommendations.push("Verifique o seu regime fiscal na Repartição de Finanças.");
  if (answers.contabilidade_organizada === "nao") recommendations.push("Contrate um contabilista certificado para organizar a contabilidade.");
  if (answers.dividas_fiscais === "sim_grandes") recommendations.push("Negocie um plano de pagamento com a Autoridade Tributária.");
  if (answers.nuit_actualizado === "nao") recommendations.push("Actualize os dados do NUIT na repartição fiscal.");
  if (recommendations.length === 0) recommendations.push("A sua situação fiscal está em boa forma! Continue a cumprir as obrigações.");

  let riskLevel: string;
  if (totalScore >= 75) riskLevel = "baixo";
  else if (totalScore >= 50) riskLevel = "medio";
  else if (totalScore >= 25) riskLevel = "alto";
  else riskLevel = "critico";

  return { score: totalScore, riskLevel, recommendations };
}
