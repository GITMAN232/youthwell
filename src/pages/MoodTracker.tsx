import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, TrendingUp, Camera, Sparkles, Shield, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import * as faceapi from "face-api.js";

const moods = [
  { emoji: "😊", label: "Great", value: "great" },
  { emoji: "🙂", label: "Good", value: "good" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "😔", label: "Low", value: "low" },
  { emoji: "😢", label: "Struggling", value: "struggling" },
];

const emotionToMood: Record<string, { value: string; emoji: string; label: string }> = {
  happy: { value: "great", emoji: "😊", label: "Great" },
  neutral: { value: "okay", emoji: "😐", label: "Okay" },
  sad: { value: "low", emoji: "😔", label: "Low" },
  angry: { value: "struggling", emoji: "😢", label: "Struggling" },
  surprised: { value: "good", emoji: "🙂", label: "Good" },
  fearful: { value: "low", emoji: "😔", label: "Low" },
  disgusted: { value: "okay", emoji: "😐", label: "Okay" },
};

// Mood value mapping for graph
const moodValueMap: Record<string, number> = {
  struggling: 1,
  low: 2,
  okay: 3,
  good: 4,
  great: 5,
};

export default function MoodTracker() {
  const { isLoading, isAuthenticated } = useAuth();
  const logMood = useMutation(api.moods.logMood);
  const moodStreak = useQuery(api.moods.getMoodStreak);
  const recentMoods = useQuery(api.moods.getUserMoods);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [triggers, setTriggers] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Detection States
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load Face API models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Failed to load face detection models:", error);
        toast.error("Failed to load AI models");
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setCameraError(null);
    } catch (error) {
      console.error("Camera access denied:", error);
      setCameraError("Camera access denied. Please try manual input.");
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const detectEmotion = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    setIsDetecting(true);
    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions;
        const maxExpression = Object.entries(expressions).reduce((a, b) => 
          a[1] > b[1] ? a : b
        );
        
        const [emotion, conf] = maxExpression;
        setDetectedEmotion(emotion);
        setConfidence(conf);
        
        const mappedMood = emotionToMood[emotion] || emotionToMood.neutral;
        setSelectedMood(mappedMood.value);
        
        toast.success(`Detected: ${mappedMood.label} ${mappedMood.emoji}`);
      } else {
        toast.error("No face detected. Please try again.");
      }
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Detection failed. Please try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleAIDetect = () => {
    setShowPrivacyModal(true);
  };

  const handlePrivacyAccept = () => {
    setShowPrivacyModal(false);
    setShowAIModal(true);
    startCamera();
  };

  const handleCloseAIModal = () => {
    setShowAIModal(false);
    stopCamera();
    setDetectedEmotion(null);
    setConfidence(0);
  };

  const handleConfirmDetection = () => {
    handleCloseAIModal();
    toast.success("Mood detected! Add details below.");
  };

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

  // Prepare data for mood graph (last 7 days)
  const moodGraphData = recentMoods?.slice(0, 7).reverse().map((mood) => ({
    date: new Date(mood._creationTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: moodValueMap[mood.mood] || 3,
    emoji: mood.emoji,
    mood: mood.mood,
  })) || [];

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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight">Smart Mood Tracker</h1>
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-muted-foreground text-lg mb-8">
            Your face tells your story — let InnerYouth read your vibe
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

          {/* Animated Mood Graph */}
          {moodGraphData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Your Mood Journey (Last 7 Days)
                  </CardTitle>
                  <CardDescription>Track your emotional patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 flex items-end justify-between gap-2">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
                      <span>😊 Great</span>
                      <span>🙂 Good</span>
                      <span>😐 Okay</span>
                      <span>😔 Low</span>
                      <span>😢 Struggling</span>
                    </div>

                    {/* Graph bars */}
                    <div className="flex-1 flex items-end justify-around gap-2 ml-16">
                      {moodGraphData.map((data, index) => (
                        <motion.div
                          key={index}
                          className="flex flex-col items-center gap-2 flex-1"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                        >
                          <motion.div
                            className="relative w-full bg-gradient-to-t from-purple-400 to-purple-600 rounded-t-lg shadow-lg cursor-pointer group"
                            style={{ height: `${(data.value / 5) * 100}%` }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.1,
                              type: "spring"
                            }}
                          >
                            {/* Emoji tooltip on hover */}
                            <motion.div
                              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              initial={{ y: 10 }}
                              whileHover={{ y: 0 }}
                            >
                              <span className="text-2xl">{data.emoji}</span>
                              <p className="text-xs font-semibold capitalize">{data.mood}</p>
                            </motion.div>
                          </motion.div>
                          
                          {/* Date label */}
                          <motion.span
                            className="text-xs text-muted-foreground font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            {data.date}
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Animated trend line overlay */}
                  <motion.div
                    className="mt-4 p-3 bg-white/80 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-sm text-gray-600">
                      <strong>Insight:</strong> {
                        moodGraphData.length >= 2 && 
                        moodGraphData[moodGraphData.length - 1].value > moodGraphData[0].value
                          ? "📈 Your mood is trending upward! Keep it up!"
                          : moodGraphData.length >= 2 && 
                            moodGraphData[moodGraphData.length - 1].value < moodGraphData[0].value
                          ? "📉 Your mood has dipped recently. Consider reaching out for support."
                          : "➡️ Your mood has been stable. Keep tracking to identify patterns."
                      }
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-600" />
                AI-Powered Detection
              </CardTitle>
              <CardDescription>Let AI detect your mood automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleAIDetect}
                disabled={!modelsLoaded}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                size="lg"
              >
                {modelsLoaded ? (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Auto Detect Mood
                  </>
                ) : (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading AI Models...
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

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

      {/* Privacy Consent Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-500" />
              Your Privacy Matters
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-4">
              We care about your privacy. The camera feed is analyzed only on your device — 
              no images are saved or shared. All processing happens locally in your browser.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPrivacyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrivacyAccept} className="bg-green-500 hover:bg-green-600">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Detection Modal */}
      <Dialog open={showAIModal} onOpenChange={handleCloseAIModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              Smart Mood Detection
            </DialogTitle>
            <DialogDescription>
              Position your face in the circle and click detect
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6 space-y-6">
            {cameraError ? (
              <div className="text-center space-y-4">
                <p className="text-red-500">{cameraError}</p>
                <Button onClick={() => setShowAIModal(false)}>
                  Try Manual Input
                </Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <motion.div
                    animate={{ scale: isDetecting ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 1.5, repeat: isDetecting ? Infinity : 0 }}
                    className="w-80 h-80 rounded-full overflow-hidden border-4 border-purple-300 shadow-2xl"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {isDetecting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"
                    >
                      <p className="text-white font-semibold text-lg">
                        Reading your vibe...
                      </p>
                    </motion.div>
                  )}
                </div>

                {detectedEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200"
                  >
                    <p className="text-2xl font-bold">
                      Detected mood: {emotionToMood[detectedEmotion]?.label} {emotionToMood[detectedEmotion]?.emoji}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {(confidence * 100).toFixed(1)}%
                    </p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={detectEmotion}
                    disabled={isDetecting}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    {isDetecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        {detectedEmotion ? "Retry" : "Detect Mood"}
                      </>
                    )}
                  </Button>
                  
                  {detectedEmotion && (
                    <Button
                      onClick={handleConfirmDetection}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Confirm Mood
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}