import { useState, useRef, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import {
  searchKnowledge,
  generateDiellyResponse,
  SUGGESTED_QUESTIONS,
  KnowledgeEntry,
} from "@/data/knowledge-base";

// @ts-ignore
const diellyAvatar = require("@/assets/images/dielly-avatar.jpg");

interface Message {
  id: string;
  type: "user" | "dielly";
  text: string;
  timestamp: Date;
  relatedEntries?: KnowledgeEntry[];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleStartChat = useCallback(() => {
    setChatStarted(true);
    const greeting = `${getGreeting()}! Que bom que você veio conversar comigo! 😊\n\nPode me perguntar sobre qualquer coisa: preços, produtos, coberturas, regras comerciais, comparativos entre planos... estou aqui pra te ajudar!`;
    const welcomeMsg: Message = {
      id: "welcome",
      type: "dielly",
      text: greeting,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  }, []);

  const sendMessage = useCallback(
    (text: string, existingMessages?: Message[]) => {
      const query = text.trim();
      if (!query) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        text: query,
        timestamp: new Date(),
      };

      const base = existingMessages || messages;
      setMessages([...base, userMsg]);
      setInputText("");
      setIsTyping(true);
      scrollToBottom();

      const results = searchKnowledge(query, 3);
      const responseText = generateDiellyResponse(query, results);
      const typingDelay = Math.min(300 + responseText.length * 2, 1500);

      setTimeout(() => {
        const diellyMsg: Message = {
          id: `dielly-${Date.now()}`,
          type: "dielly",
          text: responseText,
          timestamp: new Date(),
          relatedEntries: results.length > 1 ? results.slice(1) : undefined,
        };
        setMessages((prev) => [...prev, diellyMsg]);
        setIsTyping(false);
        scrollToBottom();
      }, typingDelay);
    },
    [messages, scrollToBottom]
  );

  const handleSend = useCallback(
    (text?: string) => {
      const query = (text || inputText).trim();
      if (!query || isTyping) return;

      if (!chatStarted) {
        setChatStarted(true);
        const greeting = `${getGreeting()}! Que bom que você veio conversar comigo! 😊`;
        const welcomeMsg: Message = {
          id: "welcome",
          type: "dielly",
          text: greeting,
          timestamp: new Date(),
        };
        setTimeout(() => sendMessage(query, [welcomeMsg]), 300);
        setInputText("");
        return;
      }

      sendMessage(query);
    },
    [inputText, isTyping, chatStarted, sendMessage]
  );

  const handleBackToWelcome = useCallback(() => {
    setChatStarted(false);
    setMessages([]);
  }, []);

  // ============================================
  // TELA DE BOAS-VINDAS (primeira vez)
  // ============================================
  if (!chatStarted) {
    return (
      <ScreenContainer>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 40,
          }}
        >
          {/* Avatar */}
          <Image
            source={diellyAvatar}
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              borderWidth: 2.5,
              borderColor: "#0a7ea4",
              marginBottom: 12,
            }}
            resizeMode="cover"
          />

          {/* Nome */}
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#11181C", marginBottom: 2 }}>
            Oi, tudo bem?
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0a7ea4", marginBottom: 8 }}>
            Eu sou a Dielly!
          </Text>

          {/* Mensagem de apresentação */}
          <Text
            style={{
              fontSize: 13,
              color: "#444",
              textAlign: "center",
              lineHeight: 19,
              marginBottom: 14,
              paddingHorizontal: 8,
            }}
          >
            Estou aqui para te ajudar a entender melhor os produtos e regras da Hapvida. Sou uma inteligência artificial e estou aprendendo cada dia mais com os vendedores Hapvida SP para poder te dar as melhores respostas!
          </Text>

          {/* Tópicos rápidos */}
          <View
            style={{
              backgroundColor: "#f0f7fa",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 10,
              width: "100%",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#11181C", marginBottom: 6 }}>
              Posso te ajudar com:
            </Text>
            {[
              "💰  Preços e cotações por faixa etária",
              "📋  Detalhes de cada produto Hapvida",
              "🔄  Comparativos entre planos",
              "📑  Regras comerciais, vigência e carência",
              "🏥  Rede credenciada e hospitais",
              "💡  Dicas e argumentos de venda",
            ].map((item, i) => (
              <Text
                key={i}
                style={{
                  fontSize: 12.5,
                  color: "#333",
                  lineHeight: 22,
                }}
              >
                {item}
              </Text>
            ))}
          </View>

          {/* Botão Iniciar Conversa */}
          <TouchableOpacity
            onPress={handleStartChat}
            style={{
              backgroundColor: "#0a7ea4",
              borderRadius: 24,
              paddingHorizontal: 28,
              paddingVertical: 13,
              width: "100%",
              alignItems: "center",
              shadowColor: "#0a7ea4",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Iniciar conversa
            </Text>
          </TouchableOpacity>

          {/* Badge IA */}
          <Text
            style={{
              fontSize: 10,
              color: "#9BA1A6",
              textAlign: "center",
              marginTop: 12,
              lineHeight: 14,
            }}
          >
            🤖 IA em constante aprendizado com a equipe Hapvida SP
          </Text>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ============================================
  // TELA DE CHAT
  // ============================================
  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={diellyAvatar}
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                borderWidth: 1.5,
                borderColor: "#0a7ea4",
              }}
            />
            <View>
              <Text style={{ fontSize: 17, fontWeight: "700", color: "#11181C" }}>
                Dielly
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: "#22C55E",
                  }}
                />
                <Text style={{ fontSize: 12, color: "#687076" }}>
                  {isTyping ? "Digitando..." : "Online"}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleBackToWelcome}
            style={{
              backgroundColor: "#f0f4f8",
              borderRadius: 18,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: "#0a7ea4", fontSize: 12, fontWeight: "600" }}>
              ← Voltar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <View key={msg.id}>
              {msg.type === "user" ? (
                <UserBubble message={msg} />
              ) : (
                <DiellyBubble
                  message={msg}
                  onRelatedPress={(q) => handleSend(q)}
                />
              )}
            </View>
          ))}

          {isTyping && <TypingIndicator />}

          {/* Sugestões após saudação inicial */}
          {messages.length === 1 && messages[0].type === "dielly" && !isTyping && (
            <View style={{ marginTop: 8, gap: 6 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#687076",
                  marginBottom: 2,
                  paddingHorizontal: 4,
                }}
              >
                Perguntas rápidas:
              </Text>
              {SUGGESTED_QUESTIONS.slice(0, 6).map((q, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSend(q)}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: "#0a7ea4",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text style={{ color: "#0a7ea4", fontSize: 13, lineHeight: 18 }}>
                    {q}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input bar */}
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Pergunte algo para a Dielly..."
            placeholderTextColor="#9BA1A6"
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => handleSend()}
            blurOnSubmit={false}
            style={{
              flex: 1,
              backgroundColor: "#f5f5f5",
              borderRadius: 22,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 15,
              color: "#11181C",
              maxHeight: 100,
              minHeight: 42,
            }}
          />
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: inputText.trim() && !isTyping ? "#0a7ea4" : "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ============================================
// COMPONENTES DE MENSAGEM
// ============================================

function UserBubble({ message }: { message: Message }) {
  return (
    <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
      <View
        style={{
          backgroundColor: "#0a7ea4",
          borderRadius: 18,
          borderBottomRightRadius: 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
          maxWidth: "82%",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 15, lineHeight: 21 }}>
          {message.text}
        </Text>
      </View>
      <Text style={{ fontSize: 10, color: "#9BA1A6", marginTop: 3, marginRight: 4 }}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

function DiellyBubble({
  message,
  onRelatedPress,
}: {
  message: Message;
  onRelatedPress: (question: string) => void;
}) {
  return (
    <View style={{ alignItems: "flex-start", marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, maxWidth: "92%" }}>
        <Image
          source={diellyAvatar}
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: "#0a7ea4",
          }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "#f0f4f8",
              borderRadius: 18,
              borderBottomLeftRadius: 4,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            {renderFormattedText(message.text)}
          </View>
          <Text style={{ fontSize: 10, color: "#9BA1A6", marginTop: 3, marginLeft: 4 }}>
            Dielly • {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>

      {message.relatedEntries && message.relatedEntries.length > 0 && (
        <View style={{ marginTop: 6, marginLeft: 32, gap: 4 }}>
          {message.relatedEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              onPress={() => onRelatedPress(entry.question)}
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderWidth: 1,
                borderColor: "#0a7ea4",
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#0a7ea4", fontSize: 12, lineHeight: 16 }}>
                {entry.question}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={{ alignItems: "flex-start", marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
        <Image
          source={diellyAvatar}
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            borderWidth: 1,
            borderColor: "#0a7ea4",
          }}
        />
        <View
          style={{
            backgroundColor: "#f0f4f8",
            borderRadius: 18,
            borderBottomLeftRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            gap: 4,
          }}
        >
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#9BA1A6" }} />
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#B0B5BA" }} />
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#C8CCD0" }} />
        </View>
      </View>
    </View>
  );
}

// ============================================
// RENDERIZAÇÃO DE TEXTO FORMATADO
// ============================================

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <View
          key={`table-${elements.length}`}
          style={{
            marginVertical: 6,
            borderRadius: 8,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#dde1e5",
          }}
        >
          {tableRows.map((row, ri) => (
            <View
              key={ri}
              style={{
                flexDirection: "row",
                backgroundColor: ri === 0 ? "#e0eef4" : ri % 2 === 0 ? "#f6f8fa" : "#fff",
                borderBottomWidth: ri < tableRows.length - 1 ? 1 : 0,
                borderBottomColor: "#dde1e5",
              }}
            >
              {row.map((cell, ci) => (
                <View
                  key={ci}
                  style={{
                    flex: 1,
                    paddingHorizontal: 7,
                    paddingVertical: 5,
                    borderRightWidth: ci < row.length - 1 ? 1 : 0,
                    borderRightColor: "#dde1e5",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11.5,
                      color: "#11181C",
                      fontWeight: ri === 0 ? "600" : "400",
                      lineHeight: 15,
                    }}
                  >
                    {cell.trim()}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      if (line.replace(/[\s|:-]/g, "").length === 0) continue;
      const cells = line.split("|").filter((c) => c.trim().length > 0);
      tableRows.push(cells);
      inTable = true;
      continue;
    }

    if (inTable) {
      flushTable();
      inTable = false;
    }

    if (line.trim() === "---") {
      elements.push(
        <View
          key={`hr-${i}`}
          style={{ height: 1, backgroundColor: "#dde1e5", marginVertical: 8 }}
        />
      );
      continue;
    }

    if (line.trim() === "") {
      elements.push(<View key={`space-${i}`} style={{ height: 4 }} />);
      continue;
    }

    elements.push(
      <Text
        key={`line-${i}`}
        style={{ fontSize: 13.5, color: "#11181C", lineHeight: 20 }}
      >
        {renderBoldText(line)}
      </Text>
    );
  }

  if (inTable) flushTable();

  return <View>{elements}</View>;
}

function renderBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={i} style={{ fontWeight: "700" }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}
