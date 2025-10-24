import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, TrendingUp, Users, Heart, BookOpen, Calendar, Home, Shield, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const moodStreak = useQuery(api.moods.getMoodStreak);
  const recentMoods = useQuery(api.moods.getUserMoods);
  const pendingRequestsCount = useQuery(api.supportCircles.getPendingRequestsCount);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading InnerYouth...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  const todayMood = recentMoods && recentMoods.length > 0 ? recentMoods[0] : null;
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || ["spachipa2@gitam.in"];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent"
              >
                Hey {user?.name || "Friend"}, let's take care of you today 💫
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-xl"
              >
                Your wellness journey continues here
              </motion.p>
            </div>
            <Link to="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all shadow-lg"
                >
                  <Home className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-700">Home</span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Mood Tracker Card */}
          <motion.div variants={cardVariants}>
            <Link to="/mood-tracker">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-lg">
                        <Smile className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-5xl">{todayMood?.emoji || "😊"}</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-800">Mood Tracker</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      {todayMood ? "Today's mood logged ✓" : "How are you feeling?"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                      <span className="text-sm font-semibold text-green-700">
                        {moodStreak?.currentStreak || 0} day streak 🔥
                      </span>
                    </div>
                    <Button variant="ghost" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl">
                      Track Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Support Circles Card */}
          <motion.div variants={cardVariants}>
            <Link to="/support-circles">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl shadow-lg">
                        <Users className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border-0 text-xs px-3 py-1">
                        Peer Support
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-gray-800">Support Circles</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Connect with peers who understand
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button variant="ghost" className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl">
                      Join a Circle
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Calm Hub Card */}
          <motion.div variants={cardVariants}>
            <Link to="/calm-hub">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-rose-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl shadow-lg">
                        <Heart className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-3xl">🧘</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-800">Calm Hub</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Breathe, relax, and find peace
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button variant="ghost" className="w-full bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl">
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Journal Card */}
          <motion.div variants={cardVariants}>
            <Link to="/journal">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-lg">
                        <BookOpen className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-3xl">📝</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-800">Journal</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Express your thoughts freely
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button variant="ghost" className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl">
                      Write Entry
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Gratitude Wall Card */}
          <motion.div variants={cardVariants}>
            <Link to="/gratitude">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl shadow-lg">
                        <Heart className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-3xl">💝</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-800">Gratitude Wall</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Share what makes you smile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button variant="ghost" className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl">
                      View Wall
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* AI Wellness Companion Card */}
          <motion.div variants={cardVariants}>
            <Link to="/chatbot">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl shadow-lg">
                        <MessageCircle className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <Sparkles className="h-6 w-6 text-indigo-400" />
                    </div>
                    <CardTitle className="text-2xl text-gray-800">AI Wellness Companion</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Chat with your wellness guide
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button variant="ghost" className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl">
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Talk to Counselor Card */}
          <motion.div variants={cardVariants}>
            <Link to="/counselor">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl shadow-lg">
                        <Calendar className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-3xl">👨‍⚕️</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-800">Talk to Counselor</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Professional support when needed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button variant="ghost" className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl">
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Admin Panel Card - Only for admins */}
          {isAdmin && (
            <motion.div variants={cardVariants}>
              <Link to="/admin-panel">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all h-full rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-gradient-to-br from-violet-400 to-violet-500 rounded-2xl shadow-lg">
                          <Shield className="h-7 w-7 text-white" strokeWidth={1.5} />
                        </div>
                        {pendingRequestsCount && pendingRequestsCount > 0 && (
                          <Badge className="bg-red-500 text-white border-0 text-xs px-3 py-1">
                            {pendingRequestsCount} pending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl text-gray-800">Admin Panel</CardTitle>
                      <CardDescription className="text-base text-gray-600">
                        Manage circle requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Button variant="ghost" className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl">
                        Open Panel
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}