import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Send, Users } from "lucide-react";
import { Link } from "react-router";
import { Id } from "@/convex/_generated/dataModel";

export default function SupportCircles() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const circles = useQuery(api.supportCircles.getCircles);
  const [selectedCircle, setSelectedCircle] = useState<Id<"supportCircles"> | null>(null);
  const messages = useQuery(
    api.supportCircles.getCircleMessages,
    selectedCircle ? { circleId: selectedCircle } : "skip"
  );
  const sendMessage = useMutation(api.supportCircles.sendMessage);

  const [messageText, setMessageText] = useState("");
  const [anonymousName] = useState(
    `Anonymous ${Math.floor(Math.random() * 1000)}`
  );

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

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedCircle) return;

    try {
      await sendMessage({
        circleId: selectedCircle,
        message: messageText,
        anonymousName,
      });
      setMessageText("");
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Support Circles</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Connect with peers in a safe, anonymous space
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Available Circles
                  </CardTitle>
                  <CardDescription>Join a conversation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {circles?.map((circle) => (
                      <Button
                        key={circle._id}
                        variant={selectedCircle === circle._id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCircle(circle._id)}
                      >
                        <div className="text-left">
                          <p className="font-medium">{circle.name}</p>
                          <p className="text-xs opacity-70">{circle.theme}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedCircle ? (
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      {circles?.find((c) => c._id === selectedCircle)?.name}
                    </CardTitle>
                    <CardDescription>
                      You're chatting as: <strong>{anonymousName}</strong>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 pr-4 mb-4">
                      <div className="space-y-4">
                        {messages?.map((msg) => (
                          <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg border bg-card"
                          >
                            <p className="text-sm font-medium text-primary mb-1">
                              {msg.anonymousName}
                            </p>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(msg._creationTime).toLocaleTimeString()}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Select a circle to start chatting
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All conversations are anonymous and supportive
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
