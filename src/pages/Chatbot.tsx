import { useAuth } from "@/hooks/use-auth";
import { Navigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
};

export default function Chatbot() {
  const { isLoading, isAuthenticated } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Load messages from localStorage or use default
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

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error);
    }
  }, [messages]);

  // Save mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, mode);
    } catch (error) {
      console.error("Failed to save mode to localStorage:", error);
    }
  }, [mode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F2FA] to-[#E0F7FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C83FD]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  const getAIResponse = async (userMessage: string, onStream?: (chunk: string) => void): Promise<string> => {
    const geminiApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    // Try Gemini API first if key is available
    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${geminiApiKey}&alt=sse`,
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

        // Fallback to non-streaming if streaming fails
        const fallbackResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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
          return botReply;
        }
      } catch (error) {
        console.error("Gemini API Error:", error);
      }
    }

    // Fallback to predefined responses
    return getFallbackResponse(userMessage);
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

    // Create a placeholder bot message for streaming
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      text: "",
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    try {
      await getAIResponse(userInput, (streamedText) => {
        // Update the bot message with streamed text
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: streamedText } : msg
          )
        );
      });
    } catch (error) {
      // If streaming fails, show error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: "Sorry, I encountered an error. Please try again." }
            : msg
        )
      );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2FA] via-[#E0F7FA] to-[#F9D5E5]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6 hover:bg-white/50 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-[#7C83FD] to-[#C7B8EA] bg-clip-text text-transparent">
              Wellness Companion 🌸
            </h1>
            <p className="text-gray-600 text-lg">
              Your friendly AI guide for mental wellness and study support
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              variant={mode === "mindful" ? "default" : "outline"}
              onClick={() => setMode("mindful")}
              className={`flex-1 transition-all ${mode === "mindful" ? "bg-gradient-to-r from-[#C7B8EA] to-[#A6E3E9] hover:shadow-lg" : ""}`}
            >
              <Leaf className="mr-2 h-4 w-4" />
              🌿 Mindful Mode
            </Button>
            <Button
              variant={mode === "boost" ? "default" : "outline"}
              onClick={() => setMode("boost")}
              className={`flex-1 transition-all ${mode === "boost" ? "bg-gradient-to-r from-[#7C83FD] to-[#A6E3E9] hover:shadow-lg" : ""}`}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              ⚡ Boost Mode
            </Button>
            <Button
              variant="outline"
              onClick={handleClearHistory}
              className="px-4 hover:bg-red-50 transition-all"
              title="Clear chat history"
            >
              🗑️
            </Button>
          </div>

          <Card className="h-[600px] flex flex-col bg-white/80 backdrop-blur-lg shadow-2xl border-0">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-[#2C2F4A]">Chat with Your Wellness Companion</CardTitle>
              <CardDescription>
                {mode === "mindful"
                  ? "Calm, mindful guidance for peace and relaxation"
                  : "Energetic motivation to help you thrive and succeed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-4">
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
                          className={`max-w-[75%] p-4 rounded-2xl shadow-md ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-[#7C83FD] to-[#A6E3E9] text-white"
                              : "bg-[#EDE7F6] text-gray-800 border border-[#C7B8EA]/30"
                          }`}
                        >
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="text-sm leading-relaxed whitespace-pre-wrap"
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
                        <div className="bg-[#EDE7F6] border border-[#C7B8EA]/30 p-4 rounded-2xl shadow-md">
                          <div className="flex gap-1">
                            <span className="animate-bounce text-[#7C83FD]">●</span>
                            <span className="animate-bounce text-[#7C83FD]" style={{ animationDelay: "0.1s" }}>●</span>
                            <span className="animate-bounce text-[#7C83FD]" style={{ animationDelay: "0.2s" }}>●</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-100 bg-white/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message... (e.g., 'I feel anxious' or 'How can I relax?')"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 border-gray-300 focus:ring-2 focus:ring-[#7C83FD] rounded-full"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon" 
                    disabled={isTyping}
                    className="bg-gradient-to-r from-[#7C83FD] to-[#A6E3E9] hover:shadow-lg transition-all rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-[#EDE7F6] to-[#E0F7FA] rounded-lg border border-[#C7B8EA]/30"
          >
            <p className="text-sm text-gray-700">
              <strong>Try asking:</strong> "I feel anxious", "How can I relax before exams?", "I'm
              stressed about studying", "I feel lonely", or "I need sleep tips"
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