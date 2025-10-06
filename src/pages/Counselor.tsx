import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Calendar, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router";

export default function Counselor() {
  const { isLoading, isAuthenticated } = useAuth();
  const requestAppointment = useMutation(api.counselor.requestAppointment);
  const requests = useQuery(api.counselor.getUserRequests);

  const [preferredTime, setPreferredTime] = useState("");
  const [reason, setReason] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
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
    if (!preferredTime || !reason.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestAppointment({
        preferredTime,
        reason,
        isAnonymous,
      });
      toast.success("Request submitted! A counselor will reach out soon.");
      setPreferredTime("");
      setReason("");
      setIsAnonymous(false);
    } catch (error) {
      toast.error("Failed to submit request");
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Talk to a Counselor
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Professional support is here when you need it
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-500" />
                Request an Appointment
              </CardTitle>
              <CardDescription>
                A licensed counselor will contact you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  type="datetime-local"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">What would you like to discuss?</Label>
                <Textarea
                  id="reason"
                  placeholder="Share what's on your mind..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous">
                  Keep my identity anonymous (counselor won't see your name)
                </Label>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!preferredTime || !reason.trim() || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </CardContent>
          </Card>

          {requests && requests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Requests</CardTitle>
                <CardDescription>Track your appointment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request._id}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {request.status === "pending" ? (
                            <Clock className="h-5 w-5 text-amber-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <span className="font-medium capitalize">
                            {request.status}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(request._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>Preferred Time:</strong> {request.preferredTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.reason}
                      </p>
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
