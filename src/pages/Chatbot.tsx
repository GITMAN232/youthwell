import { useAuth } from "@/hooks/use-auth";
import { Navigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ArrowLeft, Send, Sparkles, Leaf } from "lucide-react";

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

export default function Chatbot() {
  const { isLoading, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your wellness companion. I'm here to help with stress, anxiety, study tips, and mindfulness. How are you feeling today? 💜",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<BotMode>("mindful");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  const getBotResponse = (userMessage: string): string => {
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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Wellness Companion 🤖</h1>
            <p className="text-muted-foreground text-lg">
              Your friendly AI guide for mental wellness and study support
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              variant={mode === "mindful" ? "default" : "outline"}
              onClick={() => setMode("mindful")}
              className="flex-1"
            >
              <Leaf className="mr-2 h-4 w-4" />
              🌿 Mindful Mode
            </Button>
            <Button
              variant={mode === "boost" ? "default" : "outline"}
              onClick={() => setMode("boost")}
              className="flex-1"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              ⚡ Boost Mode
            </Button>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat with Your Wellness Companion</CardTitle>
              <CardDescription>
                {mode === "mindful"
                  ? "Calm, mindful guidance for peace and relaxation"
                  : "Energetic motivation to help you thrive and succeed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border-2 border-purple-200 dark:border-purple-800"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

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
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Try asking:</strong> "I feel anxious", "How can I relax before exams?", "I'm
              stressed about studying", "I feel lonely", or "I need sleep tips"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
