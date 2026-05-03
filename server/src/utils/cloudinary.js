import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Handles Cloudinary Stream uploads (Buffers)
 */
const uploadStream = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder },
      (error, result) => {
        if (error) {
          console.error(`[Cloudinary Stream Error] Folder: ${folder}`, error);
          resolve(null); // Resolve with null instead of rejecting to prevent crashing the server
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Handles Local Path uploads with cleanup
 */
const uploadPath = async (filePath, folder) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder
    });

    // Cleanup local file immediately after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return response.secure_url;
  } catch (error) {
    console.error(`[Cloudinary Path Error] Folder: ${folder}`, error);
    // Ensure file is deleted even if upload fails to prevent disk fill-up
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return null;
  }
};

/**
 * Polymorphic Upload Utility
 * detects if input is a Buffer or a File Path.
 */
export const uploadToCloudinary = async (fileInput, folder = "uca_gallery") => {
  if (!fileInput) return null;

  try {
    // 1. Check if it's a Buffer (Vercel/Serverless style)
    if (Buffer.isBuffer(fileInput)) {
      return await uploadStream(fileInput, folder);
    }

    // 2. Check if it's a valid string path (Local/Multer style)
    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      return await uploadPath(fileInput, folder);
    }

    console.warn(`[Cloudinary Warning] Invalid file input type for folder: ${folder}`);
    return null;
  } catch (err) {
    console.error(`[Cloudinary Unexpected Error]`, err);
    return null;
  }
};