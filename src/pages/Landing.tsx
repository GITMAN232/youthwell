import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Smile, Shield, Sparkles, Brain, Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

const teamMembers = [
  { 
    name: "P. Santhosh", 
    role: "Team Lead", 
    id: "2023003991", 
    color: "from-purple-100 to-pink-100",
    icon: "🚀",
    description: "Leading the vision and coordinating our mission to transform student mental health support."
  },
  { 
    name: "Golla Vinay Kumar", 
    role: "UI/UX & Research", 
    id: "2023004418", 
    color: "from-blue-100 to-purple-100",
    icon: "🎨",
    description: "Designing intuitive experiences and conducting user research to understand student needs."
  },
  { 
    name: "B. Kiran Nanda Kumar", 
    role: "Technical Developer", 
    id: "2023003109", 
    color: "from-green-100 to-blue-100",
    icon: "💻",
    description: "Building robust and scalable technical solutions for our mental health platform."
  },
  { 
    name: "R. Ashwini", 
    role: "Content & Outreach", 
    id: "2023003535", 
    color: "from-pink-100 to-purple-100",
    icon: "✍️",
    description: "Creating meaningful content and building community connections with students."
  },
  { 
    name: "K. Sai Theja", 
    role: "Survey & Analytics", 
    id: "2023003134", 
    color: "from-yellow-100 to-pink-100",
    icon: "📊",
    description: "Analyzing data and insights to understand mental health patterns and trends."
  },
  { 
    name: "K. Abhiram", 
    role: "Prototype Design", 
    id: "2023004291", 
    color: "from-indigo-100 to-purple-100",
    icon: "🎯",
    description: "Crafting interactive prototypes and bringing our design concepts to life."
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#2C2F4A]' : 'bg-gradient-to-br from-[#F9F6EE] via-purple-50 to-pink-50'}`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#2C2F4A]/90 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-xl font-bold">
                <Brain className="h-6 w-6 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MindConnect
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                {[
                  { id: "home", label: "Home" },
                  { id: "community", label: "Community" },
                  { id: "mood-tracking", label: "Mood Tracking" },
                  { id: "chatbot", label: "Chatbot" },
                  { id: "team", label: "Meet the Team" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-all relative group ${
                      activeSection === item.id
                        ? 'text-purple-600 dark:text-[#98FF98]'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-[#98FF98]'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#98FF98] transition-all duration-300 ${
                      activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </button>
              
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="pt-24 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          {/* Floating animations */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 text-6xl opacity-20"
          >
            💜
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 text-5xl opacity-20"
          >
            🫧
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-1/4 text-4xl opacity-20"
          >
            💜
          </motion.div>

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
            Matters 💜
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with peers, track your moods, and get real help — all anonymously.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/support-circles">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Join the Community
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Explore Dashboard
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          id="community"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
          id="mood-tracking"
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

        {/* Meet the Team Section */}
        <motion.div
          id="team"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Meet Our Team 💫
            </h2>
            <p className="text-lg text-muted-foreground">
              The creative minds behind MindConnect.
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
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className={`border-2 h-full bg-gradient-to-br ${member.color} shadow-lg hover:shadow-[0_0_30px_rgba(199,184,234,0.5)] transition-all duration-300 overflow-hidden`}>
                  <CardContent className="pt-8 text-center px-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-28 h-28 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex items-center justify-center text-5xl shadow-xl relative"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
                      <span className="relative z-10">{member.icon}</span>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                      {member.name}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
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
        </motion.div>

        {/* CTA Section */}
        <motion.div
          id="chatbot"
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

      {/* Footer */}
      <footer className="bg-[#2C2F4A] dark:bg-gray-900 border-t-4 border-[#98FF98] py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-white text-sm mb-4">
              © 2025 Team MindConnect | SDG 3: Good Health & Well-Being | Built with ❤️ by Students
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="text-[#98FF98] hover:text-[#C7B8EA] transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="text-[#98FF98] hover:text-[#C7B8EA] transition-colors">
                Feedback
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="text-[#98FF98] hover:text-[#C7B8EA] transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}