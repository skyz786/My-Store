import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  cloudinaryConfigured,
  uploadProductImage,
} from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!cloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env",
        },
        { status: 503 }
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid multipart upload request." },
        { status: 400 }
      );
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file was provided.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Image must be smaller than 5MB.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const dataUri =
      `data:${file.type};base64,` +
      buffer.toString("base64");

    const result =
      await uploadProductImage(dataUri);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "CLOUDINARY UPLOAD ERROR:"
    );

    console.error(error);

    console.error(
      "================================"
    );

    const rawMessage = error instanceof Error ? error.message : "Unknown Cloudinary error";
    const message = rawMessage
      .replace(/(api[_-]?key|api[_-]?secret|password|token)[^\s:]*[:=]\s*\S+/gi, "$1=[redacted]")
      .slice(0, 300);

    return NextResponse.json(
      {
        error: `Cloudinary upload failed: ${message}`,
      },
      { status: 500 }
    );
  }
}