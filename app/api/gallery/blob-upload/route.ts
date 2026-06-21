// app/api/gallery/blob-upload/route.ts
// Mints a scoped Vercel Blob client-upload token. The browser (lib/galleryClient.ts
// uploadGalleryImage) streams the file straight to Blob using this token, so large
// phone photos bypass the 4.5 MB serverless request-body limit.
import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
];

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        addRandomSuffix: false, // we supply our own GUID pathname
        maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB ceiling per photo
      }),
      // Client posts metadata to /api/gallery/add after upload, so nothing to do
      // here. (This callback only fires in production over a public URL.)
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload token failed:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
