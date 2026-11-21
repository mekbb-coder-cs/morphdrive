import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Endpoint = process.env.S3_ENDPOINT;
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const s3Bucket = process.env.S3_BUCKET_NAME || "morphdrive-assets";
const cdnUrl = process.env.S3_PUBLIC_CDN_URL;

export const isS3Configured = Boolean(s3Endpoint && s3AccessKeyId && s3SecretAccessKey);

export const s3Client = isS3Configured
  ? new S3Client({
      region: "auto",
      endpoint: s3Endpoint,
      credentials: {
        accessKeyId: s3AccessKeyId!,
        secretAccessKey: s3SecretAccessKey!,
      },
      forcePathStyle: true,
    })
  : null;

export class StorageService {
  /**
   * Generates a presigned upload URL for a user asset (e.g. custom textures or ghost telemetry)
   */
  static async getUploadPresignedUrl(key: string, contentType: string, expiresInSeconds = 300): Promise<{ uploadUrl: string; publicUrl: string }> {
    if (!s3Client) {
      throw new Error("S3-compatible storage is not configured in this environment.");
    }

    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
    const publicUrl = cdnUrl ? `${cdnUrl.replace(/\/$/, "")}/${key}` : uploadUrl.split("?")[0];

    return { uploadUrl, publicUrl };
  }

  /**
   * Resolves public CDN asset URL
   */
  static getPublicAssetUrl(key: string): string {
    if (cdnUrl) {
      return `${cdnUrl.replace(/\/$/, "")}/${key}`;
    }
    return `/assets/${key}`;
  }
}
