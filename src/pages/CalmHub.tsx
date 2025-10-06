import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";

export default function CalmHub() {
  const { isLoading, isAuthenticated } = useAuth();
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCount, setBreathCount] = useState(0);

  useEffect(() => {
    if (!breathingActive) return;

    const phases = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 4000 },
    ];

    let currentPhaseIndex = 0;
    let timeout: NodeJS.Timeout;

    const nextPhase = () => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setBreathPhase(phases[currentPhaseIndex].phase);
      if (currentPhaseIndex === 0) setBreathCount((c) => c + 1);
      timeout = setTimeout(nextPhase, phases[currentPhaseIndex].duration);
    };

    timeout = setTimeout(nextPhase, phases[0].duration);

    return () => clearTimeout(timeout);
  }, [breathingActive]);

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

  const journalPrompts = [
    "What made you smile today?",
    "What are three things you're grateful for?",
    "Describe a moment when you felt proud of yourself",
    "What's one thing you'd like to let go of?",
    "Write about someone who makes you feel supported",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Calm Hub</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Take a moment to breathe and relax
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Breathing Exercise</CardTitle>
                <CardDescription>
                  Follow the circle to practice deep breathing
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-12">
                <div className="relative mb-8">
                  <motion.div
                    animate={{
                      scale: breathingActive
                        ? breathPhase === "inhale"
                          ? 1.5
                          : breathPhase === "hold"
                          ? 1.5
                          : 1
                        : 1,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                  >
                    <div className="text-white text-center">
                      <p className="text-2xl font-bold capitalize">{breathPhase}</p>
                      {breathingActive && (
                        <p className="text-sm mt-2">Cycle {breathCount}</p>
                      )}
                    </div>
                  </motion.div>
                </div>

                <Button
                  size="lg"
                  onClick={() => {
                    setBreathingActive(!breathingActive);
                    if (!breathingActive) {
                      setBreathCount(0);
                      setBreathPhase("inhale");
                    }
                  }}
                >
                  {breathingActive ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start Breathing
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Journal Prompts</CardTitle>
                <CardDescription>
                  Reflect on these questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journalPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <p className="text-sm">{prompt}</p>
                    </div>
                  ))}
                </div>
                <Link to="/journal">
                  <Button className="w-full mt-4">Go to Journal</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relaxing Sounds</CardTitle>
                <CardDescription>
                  Ambient sounds to help you focus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Rain", "Ocean Waves", "Forest", "White Noise", "Gentle Piano"].map(
                    (sound) => (
                      <Button
                        key={sound}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {sound}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
