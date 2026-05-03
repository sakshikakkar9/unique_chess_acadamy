import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// 1. Configuration Module
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Internal helper to handle Cloudinary Stream uploads (Buffers)
 * Best for Vercel and memory-based file handling.
 */
const uploadStream = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Stream Error:", error);
          reject(null);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Internal helper to handle Local Path uploads
 * Best for local development or environments with persistent storage.
 */
const uploadPath = async (filePath, folder) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder
    });

    // Cleanup local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return response.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Cloudinary Path Error:", error);
    return null;
  }
};

/**
 * MAIN EXPORT: Polymorphic Upload Utility
 * Automatically detects if input is a Buffer or a File Path.
 */
export const uploadToCloudinary = async (fileInput, folder = "uca_gallery") => {
  if (!fileInput) return null;

  // Route to the correct internal module based on input type
  if (Buffer.isBuffer(fileInput)) {
    return await uploadStream(fileInput, folder);
  }

  return await uploadPath(fileInput, folder);
};