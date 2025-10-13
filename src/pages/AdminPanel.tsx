import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, XCircle, Clock, Shield } from "lucide-react";
import { Link } from "react-router";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminPanel() {
  const { isLoading, isAuthenticated, user } = useAuth();
  
  // Check if user is admin
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || ["spachipa2@gitam.in"];
  const isAdmin = user?.email && adminEmails.includes(user.email);
  
  // Only query if authenticated and is admin
  const allRequests = useQuery(
    api.supportCircles.getAllCircleRequests,
    isAuthenticated && isAdmin ? {} : "skip"
  );
  const pendingRequests = useQuery(
    api.supportCircles.getAllCircleRequests,
    isAuthenticated && isAdmin ? { status: "pending" } : "skip"
  );
  const approveRequest = useMutation(api.supportCircles.approveCircleRequest);
  const rejectRequest = useMutation(api.supportCircles.rejectCircleRequest);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<Id<"circleRequests"> | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <XCircle className="h-6 w-6" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApprove = async (requestId: Id<"circleRequests">) => {
    try {
      await approveRequest({ requestId });
      toast.success("Circle request approved successfully!");
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleRejectClick = (requestId: Id<"circleRequests">) => {
    setSelectedRequestId(requestId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequestId || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectRequest({ requestId: selectedRequestId, reason: rejectionReason });
      toast.success("Circle request rejected");
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedRequestId(null);
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const displayRequests = filter === "all" ? allRequests : 
    filter === "pending" ? pendingRequests :
    allRequests?.filter(r => r.status === filter);

  const stats = {
    total: allRequests?.length || 0,
    pending: pendingRequests?.length || 0,
    approved: allRequests?.filter(r => r.status === "approved").length || 0,
    rejected: allRequests?.filter(r => r.status === "rejected").length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-10 w-10 text-purple-500" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground text-lg">
                Manage Support Circle creation requests
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Requests</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-3xl text-yellow-500">{stats.pending}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Approved</CardDescription>
                <CardTitle className="text-3xl text-green-500">{stats.approved}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Rejected</CardDescription>
                <CardTitle className="text-3xl text-red-500">{stats.rejected}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </Button>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {displayRequests && displayRequests.length > 0 ? (
              displayRequests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle>{request.name}</CardTitle>
                            <Badge
                              variant={
                                request.status === "approved"
                                  ? "default"
                                  : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {request.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {request.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                              {request.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            <strong>Theme:</strong> {request.theme}
                          </CardDescription>
                          <CardDescription className="mt-1">
                            <strong>Requested by:</strong> {request.userName} ({request.userEmail})
                          </CardDescription>
                          <CardDescription className="mt-1">
                            <strong>Date:</strong> {new Date(request._creationTime).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{request.description}</p>
                      
                      {request.status === "rejected" && request.rejectionReason && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Rejection Reason:</strong> {request.rejectionReason}
                          </p>
                        </div>
                      )}

                      {request.status === "pending" && (
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApprove(request._id)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectClick(request._id)}
                            variant="destructive"
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200 flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No requests found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Circle Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will be visible to the requester.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-24"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
