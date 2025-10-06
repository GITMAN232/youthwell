import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const postGratitude = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("gratitude", {
      userId,
      message: args.message,
      likes: 0,
    });
  },
});

export const getGratitudePosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("gratitude")
      .order("desc")
      .take(20);
  },
});

export const likeGratitude = mutation({
  args: { gratitudeId: v.id("gratitude") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.gratitudeId);
    if (!post) throw new Error("Post not found");

    await ctx.db.patch(args.gratitudeId, {
      likes: post.likes + 1,
    });
  },
});
