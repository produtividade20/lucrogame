// Dados do Quiz sobre Investimentos - Sistema Multi-Níveis
const quizLevels = {
    beginner: {
        name: "Iniciante",
        description: "Conceitos básicos de investimentos",
        questions: [
            {
                id: 1,
                question: "Qual é a principal vantagem dos juros compostos?",
                answers: [
                    { text: "Pagam dividendos mensais", correct: false },
                    { text: "Os rendimentos geram novos rendimentos", correct: true, explanation: "Juros compostos fazem seu dinheiro trabalhar exponencialmente!" },
                    { text: "São isentos de imposto de renda", correct: false },
                    { text: "Garantem rentabilidade fixa", correct: false }
                ],
                tip: "Einstein chamou os juros compostos de 'oitava maravilha do mundo'",
                category: "Conceitos Básicos"
            },
            {
                id: 2,
                question: "Qual investimento é considerado mais seguro no Brasil?",
                answers: [
                    { text: "Ações da Petrobras", correct: false },
                    { text: "Bitcoin", correct: false },
                    { text: "Tesouro Direto", correct: true, explanation: "O Tesouro Direto é garantido pelo Governo Federal!" },
                    { text: "Fundos de ações", correct: false }
                ],
                tip: "A segurança está diretamente ligada à garantia do investimento",
                category: "Renda Fixa"
            },
            {
                id: 3,
                question: "O que significa diversificação de investimentos?",
                answers: [
                    { text: "Investir apenas em uma única ação", correct: false },
                    { text: "Espalhar investimentos em diferentes ativos", correct: true, explanation: "Diversificar reduz riscos e otimiza retornos!" },
                    { text: "Investir somente em renda fixa", correct: false },
                    { text: "Comprar sempre no mesmo dia", correct: false }
                ],
                tip: "Nunca coloque todos os ovos na mesma cesta!",
                category: "Estratégia"
            },
            {
                id: 4,
                question: "Qual é o primeiro passo para começar a investir?",
                answers: [
                    { text: "Comprar ações de grandes empresas", correct: false },
                    { text: "Criar uma reserva de emergência", correct: true, explanation: "A reserva de emergência é sua base de segurança financeira!" },
                    { text: "Investir em criptomoedas", correct: false },
                    { text: "Contratar um gerente bancário", correct: false }
                ],
                tip: "Segurança primeiro, crescimento depois",
                category: "Planejamento"
            },
            {
                id: 5,
                question: "Qual a principal diferença entre renda fixa e variável?",
                answers: [
                    { text: "Renda fixa sempre perde dinheiro", correct: false },
                    { text: "Renda variável tem previsibilidade de retorno", correct: false },
                    { text: "Renda fixa tem retorno mais previsível", correct: true, explanation: "Renda fixa oferece mais previsibilidade, renda variável mais potencial!" },
                    { text: "Não há diferença entre elas", correct: false }
                ],
                tip: "Cada tipo de investimento tem seu papel na carteira",
                category: "Tipos de Investimento"
            }
        ]
    },
    intermediate: {
        name: "Intermediário",
        description: "Estratégias avançadas e análise de mercado",
        questions: [
            {
                id: 6,
                question: "O que é o índice P/L (Preço/Lucro) de uma ação?",
                answers: [
                    { text: "O preço da ação dividido pelo lucro por ação", correct: true, explanation: "P/L indica quantos anos levaria para recuperar o investimento!" },
                    { text: "O lucro total da empresa", correct: false },
                    { text: "O preço mínimo da ação", correct: false },
                    { text: "A porcentagem de lucro garantido", correct: false }
                ],
                tip: "P/L é um dos indicadores fundamentalistas mais importantes",
                category: "Análise Fundamentalista"
            },
            {
                id: 7,
                question: "O que são FIIs (Fundos de Investimento Imobiliário)?",
                answers: [
                    { text: "Fundos que investem apenas em casas", correct: false },
                    { text: "Fundos que investem em imóveis e recebíveis imobiliários", correct: true, explanation: "FIIs permitem investir no mercado imobiliário com pouco dinheiro!" },
                    { text: "Fundos de ações de construtoras", correct: false },
                    { text: "Financiamentos imobiliários", correct: false }
                ],
                tip: "FIIs distribuem pelo menos 95% dos lucros aos cotistas",
                category: "Fundos Imobiliários"
            },
            {
                id: 8,
                question: "O que é alavancagem financeira?",
                answers: [
                    { text: "Usar dinheiro emprestado para investir", correct: true, explanation: "Alavancagem amplifica tanto ganhos quanto perdas!" },
                    { text: "Investir apenas com dinheiro próprio", correct: false },
                    { text: "Comprar ações baratas", correct: false },
                    { text: "Vender ações caras", correct: false }
                ],
                tip: "Alavancagem pode ser uma ferramenta poderosa, mas perigosa",
                category: "Estratégias Avançadas"
            },
            {
                id: 9,
                question: "O que significa 'Buy and Hold'?",
                answers: [
                    { text: "Comprar e vender rapidamente", correct: false },
                    { text: "Comprar e manter por longo prazo", correct: true, explanation: "Buy and Hold é a estratégia de Warren Buffett!" },
                    { text: "Comprar apenas ações em alta", correct: false },
                    { text: "Nunca vender as ações", correct: false }
                ],
                tip: "Tempo no mercado é mais importante que timing do mercado",
                category: "Estratégias de Investimento"
            },
            {
                id: 10,
                question: "O que é dividend yield?",
                answers: [
                    { text: "O preço da ação", correct: false },
                    { text: "A rentabilidade anual em dividendos", correct: true, explanation: "Dividend yield mostra quanto você recebe em dividendos por ano!" },
                    { text: "O lucro da empresa", correct: false },
                    { text: "A volatilidade da ação", correct: false }
                ],
                tip: "Dividend yield alto pode indicar boa distribuição de lucros",
                category: "Dividendos"
            }
        ]
    },
    advanced: {
        name: "Avançado",
        description: "Análise técnica e estratégias sofisticadas",
        questions: [
            {
                id: 11,
                question: "O que são opções financeiras?",
                answers: [
                    { text: "Contratos que dão direito de comprar/vender ativos", correct: true, explanation: "Opções são derivativos que oferecem flexibilidade estratégica!" },
                    { text: "Ações preferenciais", correct: false },
                    { text: "Títulos do governo", correct: false },
                    { text: "Fundos de investimento", correct: false }
                ],
                tip: "Opções podem ser usadas para proteção ou especulação",
                category: "Derivativos"
            },
            {
                id: 12,
                question: "O que é análise técnica?",
                answers: [
                    { text: "Análise dos fundamentos da empresa", correct: false },
                    { text: "Estudo de gráficos e padrões de preço", correct: true, explanation: "Análise técnica busca prever movimentos futuros pelos padrões passados!" },
                    { text: "Análise do balanço patrimonial", correct: false },
                    { text: "Estudo da economia", correct: false }
                ],
                tip: "Análise técnica é baseada na psicologia do mercado",
                category: "Análise Técnica"
            },
            {
                id: 13,
                question: "O que é hedge em investimentos?",
                answers: [
                    { text: "Estratégia para amplificar ganhos", correct: false },
                    { text: "Proteção contra riscos específicos", correct: true, explanation: "Hedge é como um seguro para seus investimentos!" },
                    { text: "Tipo de fundo de investimento", correct: false },
                    { text: "Método de análise fundamentalista", correct: false }
                ],
                tip: "Hedge reduz riscos mas pode limitar ganhos",
                category: "Gestão de Risco"
            },
            {
                id: 14,
                question: "O que são ETFs?",
                answers: [
                    { text: "Fundos que replicam índices", correct: true, explanation: "ETFs oferecem diversificação instantânea com baixo custo!" },
                    { text: "Ações de empresas de tecnologia", correct: false },
                    { text: "Títulos de renda fixa", correct: false },
                    { text: "Moedas digitais", correct: false }
                ],
                tip: "ETFs combinam diversificação de fundos com liquidez de ações",
                category: "Fundos de Índice"
            },
            {
                id: 15,
                question: "O que é volatilidade implícita?",
                answers: [
                    { text: "A volatilidade histórica do ativo", correct: false },
                    { text: "A volatilidade esperada pelo mercado", correct: true, explanation: "Volatilidade implícita reflete as expectativas futuras do mercado!" },
                    { text: "A diferença entre preços", correct: false },
                    { text: "O volume de negociação", correct: false }
                ],
                tip: "Volatilidade implícita é crucial para precificar opções",
                category: "Análise Avançada"
            }
        ]
    }
};

// Manter compatibilidade com código existente
const quizData = quizLevels.beginner.questions;

// Insights personalizados baseados na performance
const performanceInsights = {
    excellent: [
        {
            title: "Conhecimento Sólido",
            description: "Você já possui uma base excelente sobre investimentos. Está pronto para estratégias mais avançadas!"
        },
        {
            title: "Próximo Nível",
            description: "Com esse conhecimento, você pode explorar investimentos mais sofisticados e rentáveis."
        }
    ],
    good: [
        {
            title: "Base Consistente",
            description: "Você tem um bom entendimento básico. Vamos aprimorar alguns conceitos específicos."
        },
        {
            title: "Potencial de Crescimento",
            description: "Com algumas estratégias complementares, você pode maximizar seus resultados."
        }
    ],
    average: [
        {
            title: "Oportunidade de Aprendizado",
            description: "Há espaço para crescimento no seu conhecimento sobre investimentos."
        },
        {
            title: "Fundamentos Importantes",
            description: "Vamos fortalecer sua base com conceitos essenciais para o sucesso nos investimentos."
        }
    ]
};

// Performance badges baseados na pontuação
const performanceBadges = {
    excellent: {
        text: "Investidor Expert",
        class: "excellent"
    },
    good: {
        text: "Investidor Promissor", 
        class: "good"
    },
    average: {
        text: "Futuro Investidor",
        class: "average"
    }
};

// Dados para personalização baseada no objetivo
const objectiveCustomization = {
    liberdade: {
        title: "Liberdade Financeira",
        strategy: "Estratégia de Renda Passiva",
        focus: "Dividendos e FIIs",
        timeframe: "Longo prazo (5-10 anos)"
    },
    extra: {
        title: "Renda Extra",
        strategy: "Estratégia de Crescimento Acelerado", 
        focus: "Ações de crescimento e Day Trade",
        timeframe: "Médio prazo (1-3 anos)"
    },
    aposentadoria: {
        title: "Aposentadoria",
        strategy: "Estratégia Conservadora Crescente",
        focus: "Previdência e Tesouro IPCA+",
        timeframe: "Muito longo prazo (10+ anos)"
    }
};