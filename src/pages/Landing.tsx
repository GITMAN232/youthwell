import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Smile, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Mental Health
            <br />
            Matters
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A safe, supportive space for college students to track moods, connect with peers, and access professional help—all anonymously.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              <Button size="lg" className="text-lg px-8 py-6">
                {isAuthenticated ? "Go to Dashboard" : "Start Your Journey"}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-2 h-full">
              <CardHeader>
                <Smile className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Mood Tracking</CardTitle>
                <CardDescription>
                  Log your daily emotions, identify triggers, and build healthy streaks
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-2 h-full">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle>Anonymous Support</CardTitle>
                <CardDescription>
                  Join peer circles to share experiences in a safe, judgment-free space
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-2 h-full">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Mindfulness Tools</CardTitle>
                <CardDescription>
                  Breathing exercises, journaling prompts, and calming resources
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-2 h-full">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle>Private Journal</CardTitle>
                <CardDescription>
                  A secure space to reflect and process your thoughts privately
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-2 h-full">
              <CardHeader>
                <Shield className="h-12 w-12 text-teal-500 mb-4" />
                <CardTitle>Professional Help</CardTitle>
                <CardDescription>
                  Easy bridge to licensed counselors when you need extra support
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-2 h-full">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-rose-500 mb-4" />
                <CardTitle>Gratitude Wall</CardTitle>
                <CardDescription>
                  Share and discover positive moments from the community
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Supporting Student Mental Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-blue-600 mb-2">100%</p>
              <p className="text-muted-foreground">Anonymous & Private</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-purple-600 mb-2">24/7</p>
              <p className="text-muted-foreground">Always Available</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-pink-600 mb-2">Free</p>
              <p className="text-muted-foreground">For All Students</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center"
        >
          <Card className="border-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                You're Not Alone
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join a supportive community where your mental health comes first. Start your well-being journey today.
              </p>
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
