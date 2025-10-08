import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Send, Users, Plus, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Link } from "react-router";
import { Id } from "@/convex/_generated/dataModel";

export default function SupportCircles() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const circles = useQuery(api.supportCircles.getCircles);
  const userRequests = useQuery(api.supportCircles.getUserCircleRequests);
  const [selectedCircle, setSelectedCircle] = useState<Id<"supportCircles"> | null>(null);
  const messages = useQuery(
    api.supportCircles.getCircleMessages,
    selectedCircle ? { circleId: selectedCircle } : "skip"
  );
  const sendMessage = useMutation(api.supportCircles.sendMessage);
  const createRequest = useMutation(api.supportCircles.createCircleRequest);

  const [messageText, setMessageText] = useState("");
  const [anonymousName] = useState(
    `Anonymous ${Math.floor(Math.random() * 1000)}`
  );

  // Create Circle Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [circleTheme, setCircleTheme] = useState("");

  // Rules Dialog
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [pendingCircleId, setPendingCircleId] = useState<Id<"supportCircles"> | null>(null);

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

  const handleCreateRequest = async () => {
    if (!circleName.trim() || !circleDescription.trim() || !circleTheme.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createRequest({
        name: circleName,
        description: circleDescription,
        theme: circleTheme,
      });
      toast.success("Circle creation request submitted! Awaiting admin approval.");
      setCreateDialogOpen(false);
      setCircleName("");
      setCircleDescription("");
      setCircleTheme("");
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const handleCircleSelect = (circleId: Id<"supportCircles">) => {
    // Check if user has agreed to rules for this circle
    const rulesKey = `rules_agreed_${circleId}`;
    const hasAgreed = localStorage.getItem(rulesKey);

    if (!hasAgreed) {
      setPendingCircleId(circleId);
      setRulesDialogOpen(true);
    } else {
      setSelectedCircle(circleId);
    }
  };

  const handleRulesAgree = () => {
    if (pendingCircleId) {
      const rulesKey = `rules_agreed_${pendingCircleId}`;
      localStorage.setItem(rulesKey, "true");
      setSelectedCircle(pendingCircleId);
      setRulesDialogOpen(false);
      setPendingCircleId(null);
      toast.success("Welcome to the circle!");
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
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <CardTitle>Available Circles</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setCreateDialogOpen(true)}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Create
                    </Button>
                  </div>
                  <CardDescription>Join a conversation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {circles?.map((circle) => (
                      <Button
                        key={circle._id}
                        variant={selectedCircle === circle._id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleCircleSelect(circle._id)}
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

              {/* My Requests Section */}
              {userRequests && userRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">My Requests</CardTitle>
                    <CardDescription>Your circle creation requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userRequests.map((request) => (
                        <div
                          key={request._id}
                          className="p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-sm">{request.name}</p>
                            <Badge
                              variant={
                                request.status === "approved"
                                  ? "default"
                                  : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {request.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {request.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{request.theme}</p>
                          {request.status === "rejected" && request.rejectionReason && (
                            <p className="text-xs text-red-500 mt-2">
                              Reason: {request.rejectionReason}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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

      {/* Create Circle Request Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Circle</DialogTitle>
            <DialogDescription>
              Submit a request to create a new support circle. An admin will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Circle Name</label>
              <Input
                placeholder="e.g., Exam Stress Support"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <Input
                placeholder="e.g., Academic Pressure"
                value={circleTheme}
                onChange={(e) => setCircleTheme(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe the purpose of this circle..."
                value={circleDescription}
                onChange={(e) => setCircleDescription(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Community Rules Dialog */}
      <Dialog open={rulesDialogOpen} onOpenChange={setRulesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-6 w-6 text-purple-500" />
              Community Guidelines
            </DialogTitle>
            <DialogDescription>
              Please read and agree to these guidelines before joining the circle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">Be respectful and kind to all members</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">No discrimination based on gender, race, religion, or identity</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">No harassment, bullying, or hate speech</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">No profanity or offensive language</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">Keep conversations supportive and constructive</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">Respect privacy - what's shared here stays here</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">Report any violations to administrators</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRulesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRulesAgree} className="bg-purple-500 hover:bg-purple-600">
              I Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}