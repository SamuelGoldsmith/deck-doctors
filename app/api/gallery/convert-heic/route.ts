// app/api/gallery/convert-heic/route.ts
// HEIC/HEIF can't be decoded in a browser canvas, so iPhone "High Efficiency"
// photos are sent here (compact, ~2 MB, so well under the serverless body limit).
// We decode with heic-convert, downscale/re-encode to JPEG with sharp, and store
// the result in Blob — returning the same { pathname, url } shape as a normal
// client upload so the caller treats it identically.
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import convert from "heic-convert";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_DIMENSION = 2400; // longest edge, px — matches the client downscaler

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const jpeg = await convert({ buffer: inputBuffer, format: "JPEG", quality: 0.92 });
    const optimized = await sharp(Buffer.from(jpeg))
      .rotate() // honor any EXIF orientation
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const pathname = `gallery/${crypto.randomUUID()}.jpg`;
    const blob = await put(pathname, optimized, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: false,
    });

    return NextResponse.json({ pathname: blob.pathname, url: blob.url });
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    return NextResponse.json({ error: "HEIC conversion failed" }, { status: 500 });
  }
}
