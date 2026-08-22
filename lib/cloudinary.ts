import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export function cloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

export async function uploadProductImage(dataUri: string) {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials are missing. Check your .env file."
    );
  }

  try {
    const result = await cloudinary.uploader.upload(
      dataUri,
      {
        folder: "kids-store/products",
        resource_type: "image",
        transformation: [
          {
            width: 1600,
            height: 1600,
            crop: "limit",
          },
          {
            quality: "auto",
          },
        ],
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(
      "REAL CLOUDINARY ERROR:",
      error
    );

    throw error;
  }
}

export async function deleteProductImage(
  publicId: string
) {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;