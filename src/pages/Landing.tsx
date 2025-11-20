import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Smile, TrendingUp, Flower2, MessageCircle, Target, Sparkles, Shield, Brain, Zap, Calendar, Activity } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    icon: <Smile className="h-7 w-7" />,
    title: "Mood Tracking",
    description: "Track your emotions daily with AI-powered insights and beautiful visualizations",
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100"
  },
  {
    icon: <Brain className="h-7 w-7" />,
    title: "AI Emotional Support",
    description: "24/7 compassionate AI companion that understands and supports you",
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100"
  },
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: "Daily Journals",
    description: "Express yourself freely in a private, secure space with guided prompts",
    gradient: "from-teal-400 to-teal-600",
    bgGradient: "from-teal-50 to-teal-100"
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: "Self-Care Activities",
    description: "Personalized wellness activities designed for your mental health journey",
    gradient: "from-pink-400 to-pink-600",
    bgGradient: "from-pink-50 to-pink-100"
  },
  {
    icon: <Activity className="h-7 w-7" />,
    title: "Meditation Tools",
    description: "Guided meditation, breathing exercises, and mindfulness practices",
    gradient: "from-green-400 to-green-600",
    bgGradient: "from-green-50 to-green-100"
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Support Circles",
    description: "Connect with peers in safe, anonymous support communities",
    gradient: "from-amber-400 to-amber-600",
    bgGradient: "from-amber-50 to-amber-100"
  }
];

const testimonials = [
  {
    name: "Priya S.",
    role: "College Student",
    content: "InnerYouth helped me understand my emotions better. The AI companion feels like talking to a friend who truly gets me.",
    avatar: "💜"
  },
  {
    name: "Rahul M.",
    role: "High School Senior",
    content: "The mood tracking feature is amazing. I can finally see patterns in my mental health and take action early.",
    avatar: "🌟"
  },
  {
    name: "Ananya K.",
    role: "University Student",
    content: "This platform made mental health support accessible and judgment-free. It's been life-changing for me.",
    avatar: "🌸"
  }
];

const stats = [
  { value: "72%", label: "of youth struggle with mental health but don't seek help" },
  { value: "1 in 5", label: "young people experience mental health challenges annually" },
  { value: "85%", label: "report feeling better after using mental health tools" }
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading InnerYouth...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[95%] sm:max-w-6xl"
      >
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-lg border border-white/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl shadow-lg">
                  <Flower2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                  InnerYouth
                </span>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link to="/mood-tracker">
                <Button variant="ghost" className="text-gray-700 hover:text-purple-600 font-medium">
                  Mood Tracker
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button variant="ghost" className="text-gray-700 hover:text-purple-600 font-medium">
                  AI Support
                </Button>
              </Link>
              <Link to="/support-circles">
                <Button variant="ghost" className="text-gray-700 hover:text-purple-600 font-medium">
                  Community
                </Button>
              </Link>
            </div>

            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg rounded-2xl px-6">
                  {isAuthenticated ? "Dashboard" : "Get Started"}
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="text-7xl">🌸</div>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Empowering Youth
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              A safe, supportive space where young minds find peace, understanding, and tools to thrive emotionally
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-xl rounded-2xl">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                </motion.div>
              </Link>
              <Link to="/chatbot">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-purple-300 hover:bg-purple-50 rounded-2xl">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Try AI Companion
                  </Button>
                </motion.div>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">100% Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">AI-Powered Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="text-sm text-gray-600">Built with Empathy</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Mental Health Matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why Mental Health <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Matters</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your mental health is just as important as your physical health. You deserve support, understanding, and tools to flourish.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-3xl text-center p-8">
                  <CardContent className="pt-6">
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                      {stat.value}
                    </div>
                    <p className="text-gray-600 leading-relaxed">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-100 via-blue-100 to-teal-100 rounded-3xl p-8 sm:p-12 text-center"
          >
            <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              "Mental health is not a destination, but a journey of self-discovery and growth."
            </p>
            <p className="text-lg text-gray-600">
              Every step you take towards understanding yourself is a step towards a brighter, healthier future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Your Complete <span className="bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">Wellness Toolkit</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to support your mental health journey, all in one beautiful platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl h-full overflow-hidden">
                  <CardHeader className="p-8">
                    <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Stories of <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Hope & Healing</span>
            </h2>
            <p className="text-xl text-gray-600">Real experiences from young people like you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 bg-white shadow-lg rounded-3xl h-full">
                  <CardContent className="p-8">
                    <div className="text-5xl mb-4">{testimonial.avatar}</div>
                    <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                  <Flower2 className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                  InnerYouth
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Empowering young minds with compassionate mental health support, AI-powered tools, and a safe community for growth and healing.
              </p>
              <p className="text-purple-600 font-semibold">
                🌍 Aligned with UN SDG 3: Good Health and Well-being
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link to="/mood-tracker" className="hover:text-purple-600 transition-colors">Mood Tracker</Link></li>
                <li><Link to="/chatbot" className="hover:text-purple-600 transition-colors">AI Support</Link></li>
                <li><Link to="/journal" className="hover:text-purple-600 transition-colors">Journal</Link></li>
                <li><Link to="/calm-hub" className="hover:text-purple-600 transition-colors">Meditation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-4">Support</h3>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Crisis Helpline</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-purple-200 text-center">
            <p className="text-gray-700 text-lg">
              © 2025 InnerYouth | Made with ❤️ by <span className="font-semibold text-purple-600">Santhosh</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}