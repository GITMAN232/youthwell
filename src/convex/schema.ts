import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      anonymousName: v.optional(v.string()),
    }).index("email", ["email"]),

    moods: defineTable({
      userId: v.id("users"),
      mood: v.string(),
      emoji: v.string(),
      triggers: v.optional(v.string()),
      note: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    supportCircles: defineTable({
      name: v.string(),
      description: v.string(),
      theme: v.string(),
      createdBy: v.id("users"),
      isActive: v.boolean(),
    }).index("by_active", ["isActive"]),

    circleMessages: defineTable({
      circleId: v.id("supportCircles"),
      userId: v.id("users"),
      message: v.string(),
      anonymousName: v.string(),
      isFlagged: v.boolean(),
    }).index("by_circle", ["circleId"]),

    gratitude: defineTable({
      userId: v.id("users"),
      message: v.string(),
      likes: v.number(),
    }),

    counselorRequests: defineTable({
      userId: v.id("users"),
      preferredTime: v.string(),
      reason: v.string(),
      isAnonymous: v.boolean(),
      status: v.string(),
    }).index("by_user", ["userId"]),

    journalEntries: defineTable({
      userId: v.id("users"),
      content: v.string(),
      prompt: v.optional(v.string()),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;