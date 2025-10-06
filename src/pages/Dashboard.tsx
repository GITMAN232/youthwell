import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, TrendingUp, Users, Heart, BookOpen, Calendar, Home } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const moodStreak = useQuery(api.moods.getMoodStreak);
  const recentMoods = useQuery(api.moods.getUserMoods);

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

  const todayMood = recentMoods && recentMoods.length > 0 ? recentMoods[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  Welcome back, {user?.name || "Friend"} 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                  How are you feeling today?
                </p>
              </div>
              <Link to="/">
                <Button variant="outline" size="lg" className="gap-2">
                  <Home className="h-5 w-5" />
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col">
                <Link to="/mood-tracker" className="flex-1 flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-center justify-between">
                      <Smile className="h-8 w-8 text-blue-500" />
                      <span className="text-3xl">{todayMood?.emoji || "😊"}</span>
                    </div>
                    <CardTitle>Mood Tracker</CardTitle>
                    <CardDescription>
                      {todayMood ? "Today's mood logged" : "Log your mood today"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">
                        {moodStreak?.currentStreak || 0} day streak
                      </span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Track Now
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <Link to="/support-circles" className="flex-1 flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-center justify-between">
                      <Users className="h-8 w-8 text-purple-500 mb-2" />
                      <span className="text-xs font-semibold bg-purple-500 text-white px-2 py-1 rounded-full">
                        Peer Support
                      </span>
                    </div>
                    <CardTitle className="text-purple-700 dark:text-purple-300">
                      Support Circles
                    </CardTitle>
                    <CardDescription>
                      Join a peer group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="default" className="w-full bg-purple-500 hover:bg-purple-600">
                      Join a Circle
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col">
                <Link to="/calm-hub" className="flex-1 flex flex-col">
                  <CardHeader className="flex-1">
                    <Heart className="h-8 w-8 text-pink-500 mb-2" />
                    <CardTitle>Calm Hub</CardTitle>
                    <CardDescription>
                      Relaxation tools & breathing guides
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Start Session
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col">
                <Link to="/journal" className="flex-1 flex flex-col">
                  <CardHeader className="flex-1">
                    <BookOpen className="h-8 w-8 text-amber-500 mb-2" />
                    <CardTitle>Journal</CardTitle>
                    <CardDescription>
                      Reflect your thoughts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Write Entry
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col">
                <Link to="/gratitude" className="flex-1 flex flex-col">
                  <CardHeader className="flex-1">
                    <Heart className="h-8 w-8 text-rose-500 mb-2" />
                    <CardTitle>Gratitude Wall</CardTitle>
                    <CardDescription>
                      Share positive thoughts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Wall
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col">
                <Link to="/counselor" className="flex-1 flex flex-col">
                  <CardHeader className="flex-1">
                    <Calendar className="h-8 w-8 text-teal-500 mb-2" />
                    <CardTitle>Talk to Counselor</CardTitle>
                    <CardDescription>
                      Request private session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Book Now
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}