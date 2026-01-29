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
      { value: "2-29", label: "De 2 a 29 vidas" },
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
      { value: "sim", label: "Sim, contratação compulsória" },
      { value: "nao", label: "Não, será por adesão voluntária" },
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
      // Pular perguntas irrelevantes
      let nextQuestion = currentQuestion + 1;
      
      // Se tem apenas 1 vida, pular direto para resultado
      if (questionId === "lives" && value === "1") {
        setShowResult(true);
        return;
      }
      
      // Se tem 30+ vidas, pular pergunta de MEI
      if (questionId === "lives" && value === "30+") {
        nextQuestion = 2; // Pular para pergunta de CLT
      }
      
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const getResult = (): Result => {
    const { lives, cnpj_type, clt, prestador, socio, obrigatorio } = answers;

    // 1 vida
    if (lives === "1") {
      return {
        table: "Super Simples 1 Vida",
        description: "Tabela para empresas com apenas 1 beneficiário.",
        color: "#22C55E",
        tips: [
          "Ideal para MEI ou empresário individual",
          "Não há exigência de vínculo CLT",
          "Contratação simplificada",
        ],
      };
    }

    // 2-29 vidas
    if (lives === "2-29") {
      if (cnpj_type === "mei") {
        return {
          table: "Super Simples MEI (2-29 vidas)",
          description: "Tabela especial para Microempreendedores Individuais com natureza jurídica 213-5.",
          color: "#0EA5E9",
          tips: [
            "Exclusivo para CNPJ com código de natureza jurídica 213-5",
            "Valores diferenciados para MEI",
            "Documentação simplificada",
          ],
        };
      }
      return {
        table: "Super Simples Demais Empresas (2-29 vidas)",
        description: "Tabela para empresas de 2 a 29 vidas com outras classificações de CNPJ.",
        color: "#8B5CF6",
        tips: [
          "Para ME, LTDA, S/A e outras naturezas jurídicas",
          "Aceita sócios e prestadores de serviço",
          "Flexibilidade na composição do grupo",
        ],
      };
    }

    // 30+ vidas
    if (lives === "30+") {
      if (obrigatorio === "sim" && clt === "sim" && prestador === "nao") {
        return {
          table: "PME Compulsório (30-99 vidas)",
          description: "Tabela para contratação obrigatória com funcionários CLT.",
          color: "#F59E0B",
          tips: [
            "Contratação obrigatória para percentual mínimo",
            "Apenas funcionários com vínculo CLT",
            "Valores mais competitivos",
            "Exige E-social atualizado",
          ],
        };
      }
      return {
        table: "PME Adesão (30-99 vidas)",
        description: "Tabela para contratação por adesão voluntária.",
        color: "#EC4899",
        tips: [
          "Contratação não obrigatória",
          "Aceita sócios e prestadores de serviço",
          "Flexibilidade na adesão dos funcionários",
          "Ideal para empresas com alta rotatividade",
        ],
      };
    }

    return {
      table: "Super Simples Demais Empresas",
      description: "Tabela padrão para empresas.",
      color: "#6B7280",
      tips: [],
    };
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
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-primary">← Voltar</Text>
        </TouchableOpacity>

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
