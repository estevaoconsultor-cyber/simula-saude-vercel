const sendMessage = useCallback(
  async (text: string, existingMessages?: Message[]) => {
    try {
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

      let responseText = "Desculpe, não consegui responder agora.";

      try {
        responseText = await askDielly(
          query,
          base.map(m => ({
            role: m.type === "user" ? "user" : "assistant",
            content: m.text
          }))
        );
      } catch (apiError) {
        console.error("Erro askDielly:", apiError);
      }

      const diellyMsg: Message = {
        id: `dielly-${Date.now()}`,
        type: "dielly",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, diellyMsg]);
      setIsTyping(false);
      scrollToBottom();

    } catch (error) {
      console.error("Erro geral:", error);
      setIsTyping(false);
    }
  },
  [messages, scrollToBottom]
);