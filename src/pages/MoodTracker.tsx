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
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router";

const moods = [
  { emoji: "😊", label: "Great", value: "great" },
  { emoji: "🙂", label: "Good", value: "good" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "😔", label: "Low", value: "low" },
  { emoji: "😢", label: "Struggling", value: "struggling" },
];

export default function MoodTracker() {
  const { isLoading, isAuthenticated } = useAuth();
  const logMood = useMutation(api.moods.logMood);
  const moodStreak = useQuery(api.moods.getMoodStreak);
  const recentMoods = useQuery(api.moods.getUserMoods);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [triggers, setTriggers] = useState("");
  const [note, setNote] = useState("");
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
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    setIsSubmitting(true);
    try {
      const mood = moods.find((m) => m.value === selectedMood);
      await logMood({
        mood: selectedMood,
        emoji: mood?.emoji || "😊",
        triggers: triggers || undefined,
        note: note || undefined,
      });
      toast.success("Mood logged successfully!");
      setSelectedMood(null);
      setTriggers("");
      setNote("");
    } catch (error) {
      toast.error("Failed to log mood");
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Mood Tracker</h1>
          <p className="text-muted-foreground text-lg mb-8">
            How are you feeling today?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{moodStreak?.currentStreak || 0}</p>
                <p className="text-sm text-muted-foreground">days in a row</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Longest Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{moodStreak?.longestStreak || 0}</p>
                <p className="text-sm text-muted-foreground">days total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{recentMoods?.length || 0}</p>
                <p className="text-sm text-muted-foreground">moods logged</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Log Today's Mood</CardTitle>
              <CardDescription>Select how you're feeling right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-4">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      selectedMood === mood.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-4xl">{mood.emoji}</span>
                    <span className="text-sm font-medium">{mood.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What triggered this mood? (optional)
                </label>
                <Textarea
                  placeholder="e.g., exam stress, good news, social interaction..."
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Additional notes (optional)
                </label>
                <Textarea
                  placeholder="Any thoughts you'd like to record..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedMood || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Logging..." : "Log Mood"}
              </Button>
            </CardContent>
          </Card>

          {recentMoods && recentMoods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Moods</CardTitle>
                <CardDescription>Your mood history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMoods.slice(0, 7).map((mood) => (
                    <div
                      key={mood._id}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium capitalize">{mood.mood}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(mood._creationTime).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {mood.triggers && (
                          <p className="text-sm mt-1">Triggers: {mood.triggers}</p>
                        )}
                        {mood.note && (
                          <p className="text-sm mt-1 text-muted-foreground">
                            {mood.note}
                          </p>
                        )}
                      </div>
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
