import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Smile, TrendingUp, Flower2, Moon, Sun, MessageCircle, Target, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

const teamMembers = [
  { 
    name: "P. Santhosh", 
    role: "Project Lead", 
    id: "2023003991", 
    icon: "🧠",
    description: "Leading the vision and coordinating our mission to transform student mental health support."
  },
  { 
    name: "Golla Vinaykumar", 
    role: "UI/UX Designer", 
    id: "2023004418", 
    icon: "🎨",
    description: "Designing intuitive experiences and conducting user research to understand student needs."
  },
  { 
    name: "B. Kiran Nanda Kumar", 
    role: "Backend Dev", 
    id: "2023003109", 
    icon: "⚙️",
    description: "Building robust and scalable technical solutions for our mental health platform."
  },
  { 
    name: "R. Ashwini", 
    role: "Research & Psychology", 
    id: "2023003535", 
    icon: "💬",
    description: "Creating meaningful content and building community connections with students."
  },
  { 
    name: "K. Sai Theja", 
    role: "Data & Analytics", 
    id: "2023003134", 
    icon: "📊",
    description: "Analyzing data and insights to understand mental health patterns and trends."
  },
  { 
    name: "K. Abhiram", 
    role: "Integration & QA", 
    id: "2023004291", 
    icon: "🔧",
    description: "Crafting interactive prototypes and bringing our design concepts to life."
  },
];

export default function Landing() {
  const { isAuthenticated, isLoading, user } = useAuth();

  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || ["spachipa2@gitam.in"];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading YouthWell...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#FAF5FF] to-[#F7F8FC]"
      >
        {/* Mobile-First Navbar */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[95%] sm:max-w-6xl"
        >
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-lg border border-white/40 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
                onClick={() => scrollToSection("hero")}
              >
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Flower2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  InnerYouth
                </span>
              </motion.div>
              
              <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
                <Link to="/support-circles">
                  <Button variant="ghost" className="hover:bg-transparent text-gray-700 hover:text-purple-600 font-medium">
                    <Users className="h-5 w-5 mr-2" />
                    Community
                  </Button>
                </Link>
                <Link to="/mood-tracker">
                  <Button variant="ghost" className="hover:bg-transparent text-gray-700 hover:text-purple-600 font-medium">
                    <Smile className="h-5 w-5 mr-2" />
                    Mood Tracker
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button variant="ghost" className="hover:bg-transparent text-gray-700 hover:text-purple-600 font-medium">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    AI Companion
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-[#FF77E9] to-[#8B5CF6] hover:from-[#FF66E0] hover:to-[#7C4FE5] text-white shadow-md hover:shadow-lg transition-all rounded-xl px-4 py-2 sm:px-6 h-10 sm:h-auto text-sm sm:text-base">
                      {isAuthenticated ? "Dashboard" : "Get Started"}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section - Mobile-First */}
        <div id="hero" className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
                  Your Mental Health
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    Journey Starts Here
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  A safe space for college students to connect, heal, and thrive. 
                  Join thousands finding support, tracking wellness, and building resilience.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                  <Link to="/support-circles" className="w-full sm:w-auto">
                    <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                      <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-auto sm:py-6 bg-gradient-to-r from-[#FF77E9] to-[#8B5CF6] hover:from-[#FF66E0] hover:to-[#7C4FE5] shadow-md hover:shadow-lg transition-all rounded-xl text-white">
                        <Sparkles className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                        Join Community
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/chatbot" className="w-full sm:w-auto">
                    <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-auto sm:py-6 border-2 border-purple-200 bg-white/80 hover:bg-white hover:border-purple-300 rounded-xl shadow-sm">
                        <MessageCircle className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                        Try AI Companion
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 p-3 bg-white/80 rounded-xl shadow-sm"
                  >
                    <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">10K+</p>
                      <p className="text-xs sm:text-sm text-gray-600">Active Students</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 p-3 bg-white/80 rounded-xl shadow-sm"
                  >
                    <div className="p-2 sm:p-3 bg-pink-50 rounded-lg">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">98%</p>
                      <p className="text-xs sm:text-sm text-gray-600">Feel Supported</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 p-3 bg-white/80 rounded-xl shadow-sm"
                  >
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">24/7</p>
                      <p className="text-xs sm:text-sm text-gray-600">Always Available</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10"
                  >
                    <div className="bg-gradient-to-br from-[#FF77E9] via-[#8B5CF6] to-[#6366F1] rounded-3xl p-1 shadow-lg">
                      <div className="bg-white/95 rounded-3xl p-12 text-center backdrop-blur-sm">
                        <div className="text-9xl mb-6">🧘‍♀️</div>
                        <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Find Your Peace
                        </h3>
                        <p className="text-gray-600">
                          Start your wellness journey today
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-8 -right-8 bg-white rounded-2xl p-4 shadow-xl"
                  >
                    <p className="text-sm font-semibold text-purple-600">✨ AI-Powered Support</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-xl"
                  >
                    <p className="text-sm font-semibold text-pink-600">💜 Anonymous & Safe</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Research & Empathy Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50/50 via-purple-50/30 to-blue-50/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4"
              >
                Our <span className="bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">Research & Empathy</span> Journey
              </motion.h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                Built with deep understanding, tested with real students
              </p>
            </div>

            {/* Empathy Mapping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl">
                      <span className="text-3xl">🧩</span>
                    </div>
                    We Started by Listening
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We spoke with 50+ students across different campuses to understand their daily mental health struggles. 
                    Our empathy maps revealed feelings of pressure, isolation, and digital burnout.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div whileTap={{ scale: 0.98 }} className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                      <div className="text-4xl mb-2">😰</div>
                      <h4 className="font-semibold text-purple-900 mb-1">The Overthinker</h4>
                      <p className="text-sm text-purple-700">"Feels anxious about grades."</p>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <div className="text-4xl mb-2">🤐</div>
                      <h4 className="font-semibold text-blue-900 mb-1">The Silent Struggler</h4>
                      <p className="text-sm text-blue-700">"Keeps emotions bottled up."</p>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }} className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
                      <div className="text-4xl mb-2">😊</div>
                      <h4 className="font-semibold text-pink-900 mb-1">The Performer</h4>
                      <p className="text-sm text-pink-700">"Always looks fine but isn't inside."</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Research Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                      <span className="text-3xl">📊</span>
                    </div>
                    What We Discovered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div whileTap={{ scale: 0.98 }} className="text-center p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100">
                      <div className="text-5xl font-bold text-teal-600 mb-2">72%</div>
                      <p className="text-sm text-gray-700">said they fear judgment when talking about mental health</p>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }} className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="text-5xl font-bold text-purple-600 mb-2">64%</div>
                      <p className="text-sm text-gray-700">said therapy feels too formal</p>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }} className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100">
                      <div className="text-5xl font-bold text-pink-600 mb-2">81%</div>
                      <p className="text-sm text-gray-700">prefer peer-based emotional support</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Real Voices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl">
                      <span className="text-3xl">💬</span>
                    </div>
                    What Students Told Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div whileTap={{ scale: 0.98 }} className="p-5 rounded-xl bg-white border-2 border-purple-100 shadow-sm">
                      <p className="text-gray-700 italic">"Sometimes I just need to vent without being judged."</p>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }} className="p-5 rounded-xl bg-white border-2 border-blue-100 shadow-sm">
                      <p className="text-gray-700 italic">"I don't want advice, I just want someone to listen."</p>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.98 }} className="p-5 rounded-xl bg-white border-2 border-pink-100 shadow-sm">
                      <p className="text-gray-700 italic">"This feels more human than any wellness app I've tried."</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Testing & Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl">
                      <span className="text-3xl">🧠</span>
                    </div>
                    Built with Students, for Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our prototype was tested with 10 early users. Based on their feedback, we added features like 
                    gentle color palettes, anonymous groups, and gamified motivation streaks.
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <motion.div whileTap={{ scale: 0.98 }} className="flex-1 text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="text-3xl mb-2">🔬</div>
                      <h4 className="font-semibold text-blue-900">Test</h4>
                      <p className="text-xs text-blue-700">Prototype with users</p>
                    </motion.div>
                    <div className="text-2xl text-gray-400">→</div>
                    <motion.div whileTap={{ scale: 0.98 }} className="flex-1 text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="text-3xl mb-2">💭</div>
                      <h4 className="font-semibold text-purple-900">Feedback</h4>
                      <p className="text-xs text-purple-700">Listen & learn</p>
                    </motion.div>
                    <div className="text-2xl text-gray-400">→</div>
                    <motion.div whileTap={{ scale: 0.98 }} className="flex-1 text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                      <div className="text-3xl mb-2">✨</div>
                      <h4 className="font-semibold text-green-900">Improve</h4>
                      <p className="text-xs text-green-700">Iterate & enhance</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Future Research Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl">
                      <span className="text-3xl">🌍</span>
                    </div>
                    The Road Ahead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    We're expanding research to rural campuses and planning counselor collaboration for deeper impact. 
                    Mental health support should reach every student, everywhere.
                  </p>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-purple-700 mb-3">🌿 Your voice matters. Share your story</p>
                    <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white shadow-md">
                      Submit Anonymously
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section - Mobile-First */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4"
              >
                Everything You Need to <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Thrive</span>
              </motion.h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                Comprehensive tools designed for your mental wellness journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  icon: <Smile className="h-8 w-8" />,
                  title: "Mood Tracking",
                  description: "Track your emotions, identify patterns, and celebrate progress with daily check-ins",
                  gradient: "from-purple-500 to-purple-600",
                  bgGradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Support Circles",
                  description: "Join anonymous peer groups, share experiences, and find understanding in a safe space",
                  gradient: "from-pink-500 to-pink-600",
                  bgGradient: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20"
                },
                {
                  icon: <MessageCircle className="h-8 w-8" />,
                  title: "AI Wellness Companion",
                  description: "24/7 support with personalized guidance, mindfulness tips, and study strategies",
                  gradient: "from-blue-500 to-blue-600",
                  bgGradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
                },
                {
                  icon: <Heart className="h-8 w-8" />,
                  title: "Calm Hub",
                  description: "Breathing exercises, meditation guides, and relaxation techniques for peace of mind",
                  gradient: "from-green-500 to-green-600",
                  bgGradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
                },
                {
                  icon: <BookOpen className="h-8 w-8" />,
                  title: "Private Journal",
                  description: "Express yourself freely in a secure, private space with guided prompts and reflections",
                  gradient: "from-amber-500 to-amber-600",
                  bgGradient: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Professional Counseling",
                  description: "Connect with licensed counselors for confidential support when you need it most",
                  gradient: "from-teal-500 to-teal-600",
                  bgGradient: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20"
                }
              ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 h-full`}>
                      <CardHeader className="p-4 sm:p-6">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                          {feature.icon}
                        </div>
                        <CardTitle className="text-lg sm:text-xl md:text-2xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-sm sm:text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section - Mobile-First */}
        <motion.div
          id="team"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
                Meet the <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Dream Team</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                Passionate individuals dedicated to transforming student mental health
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="border-0 bg-white/90 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                      <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6 text-center">
                        <motion.div
                          whileTap={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-xl"
                        >
                          {member.icon}
                        </motion.div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{member.name}</h3>
                        <p className="text-xs sm:text-sm font-semibold text-purple-600 mb-2">
                          {member.role}
                        </p>
                        <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                          ID: {member.id}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer - Mobile-First with Glassmorphism */}
        <footer className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 opacity-60"></div>
          
          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/40"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Flower2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">InnerYouth</span>
                </div>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4">
                  Empowering college students with mental health support, peer connections, 
                  and wellness tools. Together, we're building a healthier, happier generation.
                </p>
                <p className="text-purple-600 text-xs sm:text-sm font-semibold">
                  🌍 Aligned with UN SDG 3: Good Health and Well-being
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Crisis Helpline</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Mental Health Resources</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Community Guidelines</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4">Get Help</h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Support Center</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">FAQs</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Feedback</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-6 sm:pt-8 border-t border-purple-200/50 text-center">
              <p className="text-gray-700 text-sm sm:text-base md:text-lg">
                © 2025 InnerYouth | Built with ❤️ for Student Mental Health
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}