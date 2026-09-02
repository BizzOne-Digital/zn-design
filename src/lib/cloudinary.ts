import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

function assertCloudinaryConfig(): void {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export interface SignedUploadParams {
  folder?: string;
  publicId?: string;
  tags?: string[];
}

export function getSignedUploadParams(
  params: SignedUploadParams = {},
): Record<string, string | number> {
  assertCloudinaryConfig();

  const timestamp = Math.round(Date.now() / 1000);
  const uploadParams: Record<string, string | number> = {
    timestamp,
    folder: params.folder ?? "zn-design",
  };

  if (params.publicId) {
    uploadParams.public_id = params.publicId;
  }
  if (params.tags?.length) {
    uploadParams.tags = params.tags.join(",");
  }

  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    apiSecret!,
  );

  return {
    ...uploadParams,
    signature,
    api_key: apiKey!,
    cloud_name: cloudName!,
  };
}

export interface UploadFromBufferOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
}

export async function uploadFromBuffer(
  buffer: Buffer,
  options: UploadFromBufferOptions = {},
): Promise<UploadApiResponse> {
  assertCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder ?? "zn-design",
        public_id: options.publicId,
        tags: options.tags,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  assertCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export async function deleteImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) {
    return;
  }
  assertCloudinaryConfig();
  await cloudinary.api.delete_resources(publicIds, { invalidate: true });
}

export { cloudinary };
