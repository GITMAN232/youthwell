import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router";

export default function Journal() {
  const { isLoading, isAuthenticated } = useAuth();
  const createEntry = useMutation(api.journal.createEntry);
  const entries = useQuery(api.journal.getUserEntries);

  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEntry({ content });
      toast.success("Entry saved");
      setContent("");
    } catch (error) {
      toast.error("Failed to save entry");
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Journal</h1>
          <p className="text-muted-foreground text-lg mb-8">
            A private space for your thoughts
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                New Entry
              </CardTitle>
              <CardDescription>Write freely, this is just for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </CardContent>
          </Card>

          {entries && entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Past Entries</CardTitle>
                <CardDescription>Your journal history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry._id}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(entry._creationTime).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
