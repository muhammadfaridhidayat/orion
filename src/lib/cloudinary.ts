const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  original_filename: string;
  format: string;
  bytes: number;
}

export class CloudinaryUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryUploadError";
  }
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Returns the upload result including the secure URL.
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new CloudinaryUploadError(
      "Cloudinary configuration is missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  // Validate file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new CloudinaryUploadError("File size exceeds the 5MB limit.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  // Use XMLHttpRequest for progress tracking
  if (onProgress) {
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              original_filename: result.original_filename,
              format: result.format,
              bytes: result.bytes,
            });
          } catch {
            reject(new CloudinaryUploadError("Failed to parse upload response."));
          }
        } else {
          let message = "Upload failed.";
          try {
            const err = JSON.parse(xhr.responseText);
            message = err.error?.message || message;
          } catch {
            // ignore parse errors
          }
          reject(new CloudinaryUploadError(message));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new CloudinaryUploadError("Network error during upload."));
      });

      xhr.addEventListener("abort", () => {
        reject(new CloudinaryUploadError("Upload was cancelled."));
      });

      xhr.open("POST", url);
      xhr.send(formData);
    });
  }

  // Simple fetch for non-progress uploads
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new CloudinaryUploadError(
      err.error?.message || "Failed to upload file to Cloudinary."
    );
  }

  const result = await res.json();
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    original_filename: result.original_filename,
    format: result.format,
    bytes: result.bytes,
  };
}
