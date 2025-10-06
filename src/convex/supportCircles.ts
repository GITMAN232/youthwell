import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
