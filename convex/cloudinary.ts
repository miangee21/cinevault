//convex/cloudinary.ts
"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateUploadSignature = action({
  args: {},
  handler: async () => {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "cinevault/posters";

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    };
  },
});

// Called on media item delete (wired up in Step 13) so orphaned
// Cloudinary images don't quietly eat into your free tier.
export const deleteCloudinaryImage = action({
  args: { publicId: v.string() },
  handler: async (_ctx, args) => {
    await cloudinary.uploader.destroy(args.publicId);
  },
});
