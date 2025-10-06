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
import { ArrowLeft, Heart, ThumbsUp } from "lucide-react";
import { Link } from "react-router";

export default function Gratitude() {
  const { isLoading, isAuthenticated } = useAuth();
  const postGratitude = useMutation(api.gratitude.postGratitude);
  const likeGratitude = useMutation(api.gratitude.likeGratitude);
  const posts = useQuery(api.gratitude.getGratitudePosts);

  const [message, setMessage] = useState("");
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
    if (!message.trim()) {
      toast.error("Please write something");
      return;
    }

    setIsSubmitting(true);
    try {
      await postGratitude({ message });
      toast.success("Posted to gratitude wall!");
      setMessage("");
    } catch (error) {
      toast.error("Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: any) => {
    try {
      await likeGratitude({ gratitudeId: postId });
    } catch (error) {
      toast.error("Failed to like");
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Gratitude Wall</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Share what you're grateful for today
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Share Your Gratitude
              </CardTitle>
              <CardDescription>
                Post anonymously to inspire others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="I'm grateful for..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSubmit}
                disabled={!message.trim() || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Posting..." : "Post to Wall"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {posts?.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-lg mb-4">{post.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {new Date(post._creationTime).toLocaleDateString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post._id)}
                        className="gap-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
