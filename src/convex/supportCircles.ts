import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getCurrentUser } from "./users";

// Helper to check if user is admin
const isAdmin = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;
  
  const user = await ctx.db.get(userId);
  if (!user) return false;
  
  const adminEmails = ["spachipa2@gitam.in"];
  return !!(user.email && adminEmails.includes(user.email));
};

export const createCircle = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("supportCircles", {
      name: args.name,
      description: args.description,
      theme: args.theme,
      createdBy: userId,
      isActive: true,
    });
  },
});

export const getCircles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("supportCircles")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    circleId: v.id("supportCircles"),
    message: v.string(),
    anonymousName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("circleMessages", {
      circleId: args.circleId,
      userId,
      message: args.message,
      anonymousName: args.anonymousName,
      isFlagged: false,
    });
  },
});

export const getCircleMessages = query({
  args: { circleId: v.id("supportCircles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("circleMessages")
      .withIndex("by_circle", (q) => q.eq("circleId", args.circleId))
      .order("desc")
      .take(50);
  },
});

// Create circle request (for regular users)
export const createCircleRequest = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("circleRequests", {
      userId,
      name: args.name,
      description: args.description,
      theme: args.theme,
      status: "pending",
    });
  },
});

// Get all circle requests (admin only)
export const getAllCircleRequests = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    let requests;
    
    if (args.status) {
      const status = args.status; // Type narrowing
      requests = await ctx.db
        .query("circleRequests")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      requests = await ctx.db.query("circleRequests").collect();
    }

    // Enrich with user data
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const user = await ctx.db.get(request.userId);
        return {
          ...request,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "Unknown",
        };
      })
    );

    return enrichedRequests;
  },
});

// Get user's own circle requests
export const getUserCircleRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("circleRequests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Approve circle request (admin only)
export const approveCircleRequest = mutation({
  args: { requestId: v.id("circleRequests") },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");

    // Create the actual circle
    await ctx.db.insert("supportCircles", {
      name: request.name,
      description: request.description,
      theme: request.theme,
      createdBy: request.userId,
      isActive: true,
    });

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: "approved",
    });

    return { success: true };
  },
});

// Reject circle request (admin only)
export const rejectCircleRequest = mutation({
  args: {
    requestId: v.id("circleRequests"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    await ctx.db.patch(args.requestId, {
      status: "rejected",
      rejectionReason: args.reason,
    });

    return { success: true };
  },
});

// Get pending requests count (for dashboard badge)
export const getPendingRequestsCount = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return 0;
    }

    const pending = await ctx.db
      .query("circleRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return pending.length;
  },
});