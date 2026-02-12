import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "lives",
    question: "Quantas vidas terá o CNPJ?",
    options: [
      { value: "1", label: "Apenas 1 vida" },
      { value: "2-15", label: "De 2 a 15 vidas" },
      { value: "16-29", label: "De 16 a 29 vidas" },
      { value: "30+", label: "30 vidas ou mais" },
    ],
  },
  {
    id: "cnpj_type",
    question: "Qual é a natureza jurídica do CNPJ?",
    options: [
      { value: "mei", label: "MEI (Microempreendedor Individual - código 213-5)" },
      { value: "outros", label: "Outras classificações (ME, LTDA, S/A, etc.)" },
    ],
  },
  {
    id: "city",
    question: "Em qual região será a contratação?",
    options: [
      { value: "sp", label: "São Paulo, Jundiaí, Mogi, Santos ou SBC" },
      { value: "demais", label: "Americana, Campinas, Sorocaba, SJC ou Rio" },
    ],
  },
  {
    id: "clt",
    question: "Todos os beneficiários são CLTs com E-social?",
    options: [
      { value: "sim", label: "Sim, todos são CLTs registrados" },
      { value: "nao", label: "Não, há sócios ou prestadores de serviço" },
    ],
  },
  {
    id: "prestador",
    question: "O CNPJ terá prestador de serviço como beneficiário?",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    id: "socio",
    question: "O CNPJ terá sócio como beneficiário?",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    id: "obrigatorio",
    question: "A contratação será obrigatória para todos os funcionários?",
    options: [
      { value: "sim", label: "Sim, contratação compulsória (100% CLT)" },
      { value: "nao", label: "Não, será por adesão (livre adesão)" },
    ],
  },
  {
    id: "coligada",
    question: "Possui mais de um CNPJ com sócios em comum (coligadas)?",
    options: [
      { value: "sim", label: "Sim, tenho CNPJs coligados" },
      { value: "nao", label: "Não, apenas 1 CNPJ" },
    ],
  },
  {
    id: "idade_max",
    question: "Algum beneficiário tem mais de 59 anos?",
    options: [
      { value: "nao", label: "Não, todos abaixo de 59 anos" },
      { value: "60-74", label: "Sim, entre 60 e 74 anos" },
      { value: "75+", label: "Sim, 75 anos ou mais" },
    ],
  },
  {
    id: "produto_nivel",
    question: "Qual nível de produto o cliente busca?",
    options: [
      { value: "entrada", label: "Entrada (Nosso Médico, Smart) - Menor custo" },
      { value: "intermediario", label: "Intermediário (Smart 300/500, Advance) - Custo-benefício" },
      { value: "premium", label: "Premium (Premium 900, Infinity) - Alta qualidade" },
    ],
  },
  {
    id: "reembolso",
    question: "O cliente precisa de reembolso?",
    options: [
      { value: "nao", label: "Não precisa de reembolso" },
      { value: "parcial", label: "Reembolso parcial já atende (Advance)" },
      { value: "total", label: "Precisa de reembolso amplo (Premium/Infinity)" },
    ],
  },
];

interface Result {
  table: string;
  description: string;
  color: string;
  tips: string[];
}

export default function TableQuizScreen() {
  const router = useRouter();
  const colors = useColors();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Avançar para próxima pergunta ou mostrar resultado
    if (currentQuestion < QUESTIONS.length - 1) {
      let nextQuestion = currentQuestion + 1;
      const qIndex = QUESTIONS.findIndex(q => q.id === questionId);
      
      // Se tem apenas 1 vida, pular para produto_nivel
      if (questionId === "lives" && value === "1") {
        const prodIdx = QUESTIONS.findIndex(q => q.id === "produto_nivel");
        if (prodIdx >= 0) { setCurrentQuestion(prodIdx); return; }
        setShowResult(true); return;
      }
      
      // Se tem 30+ vidas, pular pergunta de MEI, ir para city
      if (questionId === "lives" && value === "30+") {
        const cityIdx = QUESTIONS.findIndex(q => q.id === "city");
        if (cityIdx >= 0) { setCurrentQuestion(cityIdx); return; }
      }
      
      // Após city, se 30+ vidas ir para clt
      if (questionId === "city" && newAnswers.lives === "30+") {
        const cltIdx = QUESTIONS.findIndex(q => q.id === "clt");
        if (cltIdx >= 0) { setCurrentQuestion(cltIdx); return; }
      }
      
      // Após city, se 2-15 ou 16-29 vidas, pular para coligada
      if (questionId === "city" && (newAnswers.lives === "2-15" || newAnswers.lives === "16-29")) {
        const colIdx = QUESTIONS.findIndex(q => q.id === "coligada");
        if (colIdx >= 0) { setCurrentQuestion(colIdx); return; }
      }
      
      // Após obrigatorio, ir para coligada
      if (questionId === "obrigatorio") {
        const colIdx = QUESTIONS.findIndex(q => q.id === "coligada");
        if (colIdx >= 0) { setCurrentQuestion(colIdx); return; }
      }
      
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const getResult = (): Result => {
    const { lives, cnpj_type, clt, prestador, socio, obrigatorio, city, coligada, idade_max, produto_nivel, reembolso } = answers;

    const tips: string[] = [];
    let table = "";
    let description = "";
    let color = "#6B7280";

    // 1 vida
    if (lives === "1") {
      table = "Super Simples 1 Vida";
      description = "Tabela para empresas com apenas 1 beneficiário (sócio do CNPJ).";
      color = "#22C55E";
      tips.push("Ideal para MEI ou empresário individual");
      tips.push("Linha Smart e Advance disponíveis");
      tips.push("Não há exigência de vínculo CLT");
    }
    // 2-15 vidas
    else if (lives === "2-15") {
      if (cnpj_type === "mei") {
        table = city === "demais" ? "SS Demais Praças (MEI)" : "Super Simples MEI (2-15 vidas)";
        color = "#0EA5E9";
        description = "Tabela MEI para 2 a 15 vidas. Natureza jurídica 213-5.";
        tips.push("Exclusivo para CNPJ com código 213-5");
        tips.push("Valores diferenciados para MEI");
        tips.push("Documentação: CCMEI + Cartão CNPJ");
      } else {
        table = city === "demais" ? "SS Demais Praças (Não MEI)" : "Super Simples Demais Empresas (2-15 vidas)";
        color = "#8B5CF6";
        description = "Tabela para empresas de 2 a 15 vidas (ME, LTDA, S/A).";
        tips.push("Aceita sócios e prestadores de serviço");
        tips.push("Documentação: Cartão CNPJ + Contrato Social");
      }
    }
    // 16-29 vidas
    else if (lives === "16-29") {
      if (cnpj_type === "mei") {
        table = city === "demais" ? "SS Demais Praças (MEI)" : "Super Simples MEI (16-29 vidas)";
        color = "#0EA5E9";
        description = "Tabela MEI para 16 a 29 vidas. Maior redução de carência.";
        tips.push("Exclusivo para CNPJ com código 213-5");
        tips.push("Maior redução de carência nesta faixa");
      } else {
        table = city === "demais" ? "SS Demais Praças (Não MEI)" : "Super Simples Demais Empresas (16-29 vidas)";
        color = "#8B5CF6";
        description = "Tabela para empresas de 16 a 29 vidas.";
        tips.push("Maior redução de carência nesta faixa");
      }
    }
    // 30+ vidas
    else if (lives === "30+") {
      if (city === "demais") {
        table = "PME Demais Praças";
        color = "#F59E0B";
        description = "Tabela PME para regiões fora de SP/Jundiaí/Mogi/Santos/SBC. Funciona como adesão.";
        tips.push("Sem modalidade compulsória nesta região");
        tips.push("Carência zerada com 30+ vidas");
      } else if (obrigatorio === "sim" && clt === "sim" && prestador === "nao") {
        table = "PME Compulsório (30-99 vidas)";
        color = "#F59E0B";
        description = "Tabela para contratação compulsória com 100% CLT.";
        tips.push("100% sócios + 100% funcionários CLT ativos no e-Social");
        tips.push("Até 9 titulares: mínimo 80% do quadro");
        tips.push("10+ titulares: mínimo 90% do quadro");
        tips.push("Valores mais competitivos");
      } else {
        table = "PME Adesão (30-99 vidas)";
        color = "#EC4899";
        description = "Tabela para contratação por livre adesão.";
        tips.push("Contratação não obrigatória");
        tips.push("Aceita sócios e prestadores de serviço");
      }
    }

    // Dicas adicionais baseadas nas respostas
    if (coligada === "sim") {
      tips.push("💡 CNPJs coligados: podem somar vidas para atingir 30+ e usar tabela PME com carência zerada. Requisito: sócios em comum ou sociedade familiar.");
    }
    if (idade_max === "60-74") {
      tips.push("⚠️ Beneficiários 65-74 anos: aceitação limitada a 5% do grupo em movimentação.");
    }
    if (idade_max === "75+") {
      tips.push("⚠️ Beneficiários 75+ anos: aceitação limitada a 1% do grupo. Avalie com gestor.");
    }
    if (prestador === "sim") {
      tips.push("⚠️ Prestadores de serviço: aceitos apenas na VENDA (Comercial). NÃO aceitos em inclusões pós-implantação.");
      tips.push("⚠️ Premium 900.1 e Infinity: NÃO aceitam prestadores de serviço.");
    }
    if (produto_nivel === "premium" || reembolso === "total") {
      tips.push("🏥 Produtos Premium/Infinity: reembolso amplo, assistência viagem internacional, hospitais de referência.");
    }
    if (reembolso === "parcial") {
      tips.push("💰 Advance 600: reembolso consulta R$ 75 | Advance 700: reembolso consulta R$ 96.");
    }
    if (reembolso === "total") {
      tips.push("💰 Premium 900: reembolso consulta R$ 240 | Infinity: reembolso consulta R$ 400.");
    }

    return { table, description, color, tips };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const goToSimulation = () => {
    router.back();
  };

  if (showResult) {
    const result = getResult();
    return (
      <ScreenContainer className="flex-1">
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="items-center mb-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: result.color + "20" }}
            >
              <Text className="text-4xl">✅</Text>
            </View>
            <Text className="text-xl font-bold text-foreground text-center">
              Tabela Recomendada
            </Text>
          </View>

          {/* Resultado */}
          <View
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: result.color + "15" }}
          >
            <Text
              className="text-2xl font-bold text-center mb-3"
              style={{ color: result.color }}
            >
              {result.table}
            </Text>
            <Text className="text-base text-muted text-center">
              {result.description}
            </Text>
          </View>

          {/* Dicas */}
          {result.tips.length > 0 && (
            <View className="bg-surface rounded-xl p-4 border border-border mb-6">
              <Text className="text-base font-semibold text-foreground mb-3">
                💡 Informações Importantes
              </Text>
              {result.tips.map((tip, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-primary mr-2">•</Text>
                  <Text className="text-sm text-muted flex-1">{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Ações */}
          <TouchableOpacity
            onPress={goToSimulation}
            className="bg-primary py-4 rounded-xl items-center mb-3"
            style={{ opacity: 1 }}
          >
            <Text className="text-white font-semibold text-base">
              Ir para Simulação →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={resetQuiz}
            className="py-3 items-center"
          >
            <Text className="text-primary font-medium">
              Refazer Quiz
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity 
            onPress={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
              } else {
                router.back();
              }
            }}
          >
            <Text className="text-primary">← {currentQuestion > 0 ? "Pergunta Anterior" : "Sair"}</Text>
          </TouchableOpacity>
          {currentQuestion > 0 && (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-muted">Sair do Quiz</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-2xl font-bold text-foreground mb-2">
          Descubra sua Tabela
        </Text>
        <Text className="text-sm text-muted mb-6">
          Responda as perguntas para encontrar a tabela ideal
        </Text>

        {/* Progress Bar */}
        <View className="bg-border rounded-full h-2 mb-6">
          <View
            className="bg-primary rounded-full h-2"
            style={{ width: `${progress}%` }}
          />
        </View>

        {/* Pergunta */}
        <View className="bg-surface rounded-xl p-4 border border-border mb-6">
          <Text className="text-xs text-muted mb-2">
            Pergunta {currentQuestion + 1} de {QUESTIONS.length}
          </Text>
          <Text className="text-lg font-semibold text-foreground">
            {question.question}
          </Text>
        </View>

        {/* Opções */}
        <View className="gap-3">
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleAnswer(question.id, option.value)}
              className="bg-surface rounded-xl p-4 border-2 border-border active:border-primary"
              style={{ opacity: 1 }}
            >
              <Text className="text-base text-foreground">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
