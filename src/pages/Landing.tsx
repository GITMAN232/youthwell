import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Smile, TrendingUp, Brain, Moon, Sun, MessageCircle, Target, Settings } from "lucide-react";
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
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || ["spachipa2@gitam.in"];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F9FB] via-[#F9D5E5] to-[#A6E3E9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#C7B8EA] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading MindConnect...</p>
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-[#F9F9FB]'} transition-colors duration-500`}>
      {/* Sticky Navbar with Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-[#C7B8EA]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#A6E3E9] to-[#C7B8EA] bg-clip-text text-transparent">
                MindConnect
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {[
                { id: "home", label: "Home", type: "scroll" },
                { id: "community", label: "Community", type: "link", path: "/support-circles" },
                { id: "mood-tracking", label: "Mood Tracking", type: "link", path: "/mood-tracker" },
                { id: "chatbot", label: "Chatbot", type: "link", path: "/chatbot" },
                { id: "team", label: "Meet the Team", type: "scroll" },
                ...(isAdmin ? [{ id: "admin", label: "Admin Panel", type: "link", path: "/admin-panel" }] : []),
              ].map((item) => (
                item.type === "link" ? (
                  <Link
                    key={item.id}
                    to={item.path!}
                    className="text-sm font-medium transition-all relative group text-gray-700 dark:text-gray-300 hover:text-[#C7B8EA]"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#A6E3E9] to-[#C7B8EA] transition-all duration-300 w-0 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(166,227,233,0.6)]" />
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-all relative group ${
                      activeSection === item.id
                        ? 'text-[#C7B8EA]'
                        : 'text-gray-700 dark:text-gray-300 hover:text-[#C7B8EA]'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#A6E3E9] to-[#C7B8EA] transition-all duration-300 ${
                      activeSection === item.id ? 'w-full shadow-[0_0_8px_rgba(166,227,233,0.6)]' : 'w-0 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(166,227,233,0.6)]'
                    }`} />
                  </button>
                )
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </button>
              
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button variant="default" size="sm" className="bg-gradient-to-r from-[#A6E3E9] to-[#C7B8EA] hover:shadow-lg transition-all duration-300">
                  {isAuthenticated ? "Dashboard" : "Sign In"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Your Mental Health
              <br />
              <span className="bg-gradient-to-r from-[#A6E3E9] via-[#C7B8EA] to-[#F9D5E5] bg-clip-text text-transparent">
                Matters 🌿
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Connect with peers, find support, and discover tools to help you thrive. 
              You're never alone in your journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/support-circles">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-[#A6E3E9] to-[#C7B8EA] hover:shadow-[0_0_20px_rgba(166,227,233,0.5)] transition-all duration-300">
                  🟢 Join Our Community
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-[#C7B8EA] hover:bg-[#C7B8EA]/10 hover:shadow-[0_0_15px_rgba(199,184,234,0.3)] transition-all duration-300">
                  Anonymous Chat
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#A6E3E9]" />
                <span>10K+ Youth Connected 🌐</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#C7B8EA]" />
                <span>24/7 Support 💬</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#F9D5E5] via-[#C7B8EA] to-[#A6E3E9] p-8 backdrop-blur-sm">
              <div className="text-center text-8xl mb-4">🧘‍♀️</div>
              <div className="text-center text-white text-xl font-semibold">Find Your Peace</div>
              
              {/* Floating stat bubbles */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg"
              >
                <p className="text-sm font-semibold text-gray-800">98% feel supported</p>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg"
              >
                <p className="text-sm font-semibold text-gray-800">24/7 always here</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* About / Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-br from-white/50 to-[#F9D5E5]/30 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              How We Support You
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Simple tools designed with your wellbeing in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 bg-gradient-to-br from-[#C7B8EA]/20 to-[#A6E3E9]/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C7B8EA] to-[#A6E3E9] flex items-center justify-center text-3xl">
                    🧭
                  </div>
                  <CardTitle className="text-xl">Track your mood daily</CardTitle>
                  <CardDescription className="text-base">
                    Understand your emotional patterns and build healthy habits
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 bg-gradient-to-br from-[#A6E3E9]/20 to-[#F9D5E5]/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#A6E3E9] to-[#F9D5E5] flex items-center justify-center text-3xl">
                    🤝
                  </div>
                  <CardTitle className="text-xl">Find peers who understand</CardTitle>
                  <CardDescription className="text-base">
                    Join supportive circles and share experiences anonymously
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 bg-gradient-to-br from-[#F9D5E5]/20 to-[#C7B8EA]/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F9D5E5] to-[#C7B8EA] flex items-center justify-center text-3xl">
                    💡
                  </div>
                  <CardTitle className="text-xl">Access helpful tools</CardTitle>
                  <CardDescription className="text-base">
                    Mindfulness exercises, journaling, and AI wellness companion
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mood Tracker Preview */}
      <motion.div
        id="mood-tracking"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Track Your Emotional Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Understanding your moods is the first step to better mental health. 
              Our intuitive tracker helps you identify patterns, triggers, and celebrate progress.
            </p>
            <Link to="/mood-tracker">
              <Button size="lg" className="bg-gradient-to-r from-[#C7B8EA] to-[#F9D5E5] hover:shadow-lg transition-all duration-300">
                Start Tracking
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <Card className="border-0 bg-gradient-to-br from-white/80 to-[#C7B8EA]/10 backdrop-blur-md shadow-xl p-8">
            <div className="flex justify-around mb-6">
              {["😊", "😌", "😐", "😔", "😢"].map((emoji, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-5xl hover:drop-shadow-lg transition-all"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
            <div className="h-48 bg-gradient-to-br from-[#A6E3E9]/20 to-[#C7B8EA]/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Smile className="h-16 w-16 mx-auto mb-2 text-[#C7B8EA]" />
                <p className="text-gray-600 dark:text-gray-300">Your mood chart will appear here</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Meet the Team Section */}
      <motion.div
        id="team"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-br from-[#F9D5E5]/20 to-[#A6E3E9]/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Meet Our Team 💫
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Passionate individuals dedicated to your wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <Card className="border-0 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-[0_0_30px_rgba(199,184,234,0.4)] transition-all duration-300 overflow-hidden">
                  <CardContent className="pt-8 text-center px-6">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#A6E3E9] via-[#C7B8EA] to-[#F9D5E5] flex items-center justify-center text-5xl shadow-xl"
                    >
                      {member.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                      {member.name}
                    </h3>
                    <p className="text-sm text-[#C7B8EA] font-semibold mb-2">
                      {member.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      ID: {member.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#C7B8EA] via-[#A6E3E9] to-[#F9D5E5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">About Us</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                MindConnect is dedicated to supporting youth mental health through 
                peer connection and accessible wellness tools.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Crisis Helpline</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mental Health Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/20">
            <p className="text-white/90 text-sm">
              © 2025 MindConnect | Built with ❤️ for Youth Wellbeing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}