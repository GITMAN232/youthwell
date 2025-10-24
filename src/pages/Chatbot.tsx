import { useAuth } from "@/hooks/use-auth";
import { Navigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Sparkles, Leaf } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type BotMode = "mindful" | "boost";

type ChatSession = {
  id: string;
  messages: Message[];
  timestamp: Date;
};

const mindfulResponses: Record<string, string> = {
  anxious: "Take a deep breath. Anxiety is temporary. Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. You're safe right now. 🌿",
  stressed: "It's okay to feel overwhelmed. Break your tasks into smaller steps. Take a 5-minute break to stretch or walk. Remember, progress over perfection. 🧘",
  exam: "Exam stress is normal. Try studying in 25-minute focused sessions with 5-minute breaks (Pomodoro technique). Stay hydrated and get enough sleep. You've got this. 📚",
  relax: "Let's find calm together. Close your eyes and focus on your breath. Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. 🌸",
  sleep: "Good sleep is essential. Try a wind-down routine: dim lights 1 hour before bed, avoid screens, try gentle stretching or reading. Your mind needs rest. 🌙",
  lonely: "Feeling lonely is valid. Reach out to a friend, join a support circle, or write in your journal. Connection starts with small steps. You matter. 💜",
  default: "I'm here to support you. Tell me more about what you're feeling, or ask me about relaxation techniques, study tips, or mindfulness practices. 🌿"
};

const boostResponses: Record<string, string> = {
  anxious: "You've got this! Channel that nervous energy into action. Make a quick to-do list and tackle one thing at a time. You're stronger than you think! 💪",
  stressed: "Stress means you care! Use that energy. Prioritize your top 3 tasks today. Crush them one by one. You're capable of amazing things! 🚀",
  exam: "Exam time = game time! You've prepared for this. Review your notes, stay confident, and trust your knowledge. You're going to ace this! 🎯",
  relax: "Take a power break! Do 10 jumping jacks, drink water, and shake it off. Then come back stronger. You're unstoppable! ⚡",
  sleep: "Rest is productive! Your brain consolidates learning during sleep. Prioritize 7-8 hours tonight. Tomorrow you'll be sharper and ready to win! 🏆",
  lonely: "You're not alone in this journey! Join a study group, reach out to classmates, or connect in our support circles. Your tribe is waiting! 🌟",
  default: "Let's turn that energy into action! Tell me what's on your mind - whether it's study stress, motivation, or time management. I'm here to help you thrive! ⚡"
};

const STORAGE_KEYS = {
  MESSAGES: "mindconnect_chatbot_messages",
  MODE: "mindconnect_chatbot_mode",
  HISTORY: "mindconnect_chatbot_history",
};

export default function Chatbot() {
  const { isLoading, isAuthenticated } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage:", error);
    }
    return [
      {
        id: "1",
        text: "Hi! I'm your wellness companion. I'm here to help with stress, anxiety, study tips, and mindfulness. How are you feeling today? 💜",
        sender: "bot",
        timestamp: new Date(),
      },
    ];
  });
  
  const [inputText, setInputText] = useState("");
  
  const [mode, setMode] = useState<BotMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODE);
      if (saved && (saved === "mindful" || saved === "boost")) {
        return saved as BotMode;
      }
    } catch (error) {
      console.error("Failed to load mode from localStorage:", error);
    }
    return "mindful";
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((session: ChatSession) => ({
          ...session,
          timestamp: new Date(session.timestamp),
          messages: session.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage:", error);
    }
    return [];
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, mode);
    } catch (error) {
      console.error("Failed to save mode to localStorage:", error);
    }
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [chatHistory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading InnerYouth companion...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  const getAIResponse = async (userMessage: string, onStream?: (chunk: string) => void): Promise<string> => {
    const geminiApiKey = import.meta.env.VITE_GOOGLE_API_KEY || "AIzaSyB1bnk-L5iR4X5cZR_ZNXQoEM_WZiZLC-E";
    
    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${geminiApiKey}&alt=sse`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ 
                parts: [{ 
                  text: `You are a wellness companion for college students. Respond in a ${mode === "mindful" ? "calm, mindful, and supportive" : "energetic, motivational, and encouraging"} tone. User message: ${userMessage}` 
                }] 
              }],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Gemini API request failed");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader && onStream) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const jsonData = JSON.parse(line.slice(6));
                  const text = jsonData?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    fullText += text;
                    onStream(fullText);
                  }
                } catch (e) {
                  // Skip invalid JSON lines
                }
              }
            }
          }
        }

        if (fullText) {
          return fullText;
        }

        // Fallback to non-streaming if streaming didn't work
        const fallbackResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ 
                parts: [{ 
                  text: `You are a wellness companion for college students. Respond in a ${mode === "mindful" ? "calm, mindful, and supportive" : "energetic, motivational, and encouraging"} tone. User message: ${userMessage}` 
                }] 
              }],
            }),
          }
        );

        const data = await fallbackResponse.json();
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (botReply) {
          if (onStream) {
            onStream(botReply);
          }
          return botReply;
        }
      } catch (error) {
        console.error("Gemini API Error:", error);
      }
    }

    // Use fallback responses
    const fallbackText = getFallbackResponse(userMessage);
    if (onStream) {
      onStream(fallbackText);
    }
    return fallbackText;
  };

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const responses = mode === "mindful" ? mindfulResponses : boostResponses;

    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("nervous")) {
      return responses.anxious;
    }
    if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm")) {
      return responses.stressed;
    }
    if (lowerMessage.includes("exam") || lowerMessage.includes("test") || lowerMessage.includes("study")) {
      return responses.exam;
    }
    if (lowerMessage.includes("relax") || lowerMessage.includes("calm") || lowerMessage.includes("peace")) {
      return responses.relax;
    }
    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("rest")) {
      return responses.sleep;
    }
    if (lowerMessage.includes("lonely") || lowerMessage.includes("alone") || lowerMessage.includes("isolated")) {
      return responses.lonely;
    }

    return responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const botMessageId = (Date.now() + 1).toString();
      
      await getAIResponse(userInput, (streamedText) => {
        // On first chunk, add the bot message and stop typing indicator
        setMessages((prev) => {
          const existingMsg = prev.find(m => m.id === botMessageId);
          if (!existingMsg) {
            setIsTyping(false);
            return [...prev, {
              id: botMessageId,
              text: streamedText,
              sender: "bot" as const,
              timestamp: new Date(),
            }];
          }
          return prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: streamedText } : msg
          );
        });
      });
    } catch (error) {
      setIsTyping(false);
      const errorMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, {
        id: errorMessageId,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot" as const,
        timestamp: new Date(),
      }]);
      toast.error("Failed to get response");
    }
  };

  const handleClearHistory = () => {
    const defaultMessage: Message = {
      id: "1",
      text: "Hi! I'm your wellness companion. I'm here to help with stress, anxiety, study tips, and mindfulness. How are you feeling today? 💜",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([defaultMessage]);
    toast.success("Chat history cleared");
  };

  const handleNewChat = () => {
    // Save current chat to history if it has more than just the welcome message
    if (messages.length > 1) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        messages: messages,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [newSession, ...prev]);
      toast.success("Chat saved to history");
    }
    
    // Start fresh chat
    const defaultMessage: Message = {
      id: Date.now().toString(),
      text: "Hi! I'm your wellness companion. I'm here to help with stress, anxiety, study tips, and mindfulness. How are you feeling today? 💜",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([defaultMessage]);
  };

  const handleLoadChat = (sessionId: string) => {
    const session = chatHistory.find((s) => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setShowHistory(false);
      toast.success("Chat loaded");
    }
  };

  const handleDeleteChatSession = (sessionId: string) => {
    setChatHistory((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Chat deleted from history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 50, 0], x: [0, -40, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <Link to="/dashboard">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" className="mb-6 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all shadow-lg rounded-2xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full shadow-xl"
            >
              <Sparkles className="h-6 w-6 text-purple-500" />
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ✨ Wellness Companion
              </span>
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Your AI Wellness Guide
            </h1>
            <p className="text-gray-600 text-lg">
              Here to support your mental wellness journey, 24/7
            </p>
          </div>

          {/* Mode Selection with New Chat and History buttons */}
          <div className="flex gap-3 mb-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                variant={mode === "mindful" ? "default" : "outline"}
                onClick={() => setMode("mindful")}
                className={`w-full h-14 rounded-2xl transition-all ${
                  mode === "mindful"
                    ? "bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-xl"
                    : "bg-white/70 backdrop-blur-sm hover:bg-white/90 border-purple-200"
                }`}
              >
                <Leaf className="mr-2 h-5 w-5" />
                <span className="text-base font-semibold">🌿 Mindful Mode</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                variant={mode === "boost" ? "default" : "outline"}
                onClick={() => setMode("boost")}
                className={`w-full h-14 rounded-2xl transition-all ${
                  mode === "boost"
                    ? "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-xl"
                    : "bg-white/70 backdrop-blur-sm hover:bg-white/90 border-blue-200"
                }`}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                <span className="text-base font-semibold">⚡ Boost Mode</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleNewChat}
                className="h-14 px-6 bg-white/70 backdrop-blur-sm hover:bg-green-50 border-green-200 rounded-2xl"
                title="Start new chat"
              >
                <span className="text-xl">🔄</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                className="h-14 px-6 bg-white/70 backdrop-blur-sm hover:bg-blue-50 border-blue-200 rounded-2xl"
                title="Chat history"
              >
                <span className="text-xl">🕓</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleClearHistory}
                className="h-14 px-6 bg-white/70 backdrop-blur-sm hover:bg-red-50 border-red-200 rounded-2xl"
                title="Clear chat history"
              >
                <span className="text-xl">🗑️</span>
              </Button>
            </motion.div>
          </div>

          {/* Chat History Panel */}
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-purple-600">🕓 Chat History</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No saved chats yet. Start a conversation and click "New Chat" to save it!</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {chatHistory.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl cursor-pointer transition-all border border-purple-200 flex items-center justify-between"
                    >
                      <div onClick={() => handleLoadChat(session.id)} className="flex-1">
                        <p className="font-semibold text-gray-800">
                          Chat from {session.timestamp.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.messages.length} messages • {session.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChatSession(session.id);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        🗑️
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Chat Card */}
          <Card className="h-[600px] flex flex-col bg-white/60 backdrop-blur-2xl shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 px-6 py-6 max-h-[450px]">
                <div className="space-y-4 pr-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 25,
                          duration: 0.4 
                        }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <motion.div
                          initial={msg.sender === "bot" ? { x: -20 } : { x: 20 }}
                          animate={{ x: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          whileHover={{ 
                            scale: 1.02,
                            transition: { duration: 0.2 }
                          }}
                          className={`max-w-[80%] p-5 rounded-3xl shadow-lg ${
                            msg.sender === "user"
                              ? "bg-gradient-to-br from-purple-400 to-purple-500 text-white"
                              : "bg-white/90 backdrop-blur-sm text-gray-800 border border-purple-100"
                          }`}
                        >
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="text-base leading-relaxed whitespace-pre-wrap"
                          >
                            {msg.text}
                          </motion.p>
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-xs opacity-70 mt-2"
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/90 backdrop-blur-sm border border-purple-100 p-5 rounded-3xl shadow-lg">
                          <div className="flex gap-2">
                            <motion.span
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                            <motion.span
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                            <motion.span
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-6 bg-white/50 backdrop-blur-sm border-t border-purple-100">
                <div className="flex gap-3">
                  <Input
                    placeholder="Share what's on your mind..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 h-14 border-purple-200 focus:ring-2 focus:ring-purple-400 rounded-2xl bg-white/80 backdrop-blur-sm text-base px-6"
                    disabled={isTyping}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleSendMessage} 
                      size="icon" 
                      disabled={isTyping}
                      className="h-14 w-14 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all rounded-2xl"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-5 bg-white/60 backdrop-blur-xl rounded-2xl border border-purple-100 shadow-lg"
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-purple-600">💡 Try asking:</strong> "I feel anxious", "How can I relax before exams?", "I'm stressed about studying", "I feel lonely", or "I need sleep tips"
            </p>
            {!import.meta.env.VITE_GOOGLE_API_KEY && (
              <p className="text-xs text-amber-600 mt-2">
                ℹ️ Using fallback responses. Add VITE_GOOGLE_API_KEY to enable AI-powered responses.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}