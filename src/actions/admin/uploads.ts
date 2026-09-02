"use server";

import type { ActionResponse } from "@/types/actions";
import { getSignedUploadParams } from "@/lib/cloudinary";
import { uploadSignatureSchema } from "@/lib/validations/admin";
import { logActivity, requireAdmin, validationError } from "@/actions/helpers";

export type UploadSignatureData = {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder: string;
};

export async function createUploadSignature(
  input: unknown,
): Promise<ActionResponse<UploadSignatureData>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = uploadSignatureSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const folder = parsed.data.folder ?? "zn-design";
    const params = getSignedUploadParams({ folder });

    await logActivity({
      action: "upload_signature",
      entity: "upload",
      details: { folder },
      adminEmail: admin.email,
    });

    return {
      success: true,
      data: {
        signature: String(params.signature),
        timestamp: Number(params.timestamp),
        api_key: String(params.api_key),
        cloud_name: String(params.cloud_name),
        folder: String(params.folder),
      },
    };
  } catch (error) {
    console.error("createUploadSignature error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to generate upload signature.",
    };
  }
}
