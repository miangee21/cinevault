//convex/storage.ts
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Returns a short-lived URL for the client to directly upload the file
    return await ctx.storage.generateUploadUrl();
  },
});
