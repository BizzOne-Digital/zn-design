import { NextRequest } from "next/server";
import { z } from "zod";
import { getSignedUploadParams } from "@/lib/cloudinary";
import {
  formatZodErrors,
  jsonError,
  jsonSuccess,
  requireAdminSession,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

const uploadRequestSchema = z.object({
  folder: z.string().trim().min(1).max(120).optional(),
  publicId: z.string().trim().min(1).max(200).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(10).optional(),
});

export async function POST(request: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return admin.response;
  }

  try {
    const body = await request.json();
    const parsed = uploadRequestSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Invalid upload parameters.", 400, {
        fieldErrors: formatZodErrors(parsed.error),
      });
    }

    const signedParams = getSignedUploadParams(parsed.data);

    return jsonSuccess({ upload: signedParams });
  } catch (error) {
    console.error("POST /api/uploads error:", error);

    if (error instanceof Error && error.message.includes("Cloudinary")) {
      return jsonError("Upload service is not configured.", 503);
    }

    return jsonError("Unable to prepare upload.", 500);
  }
}
