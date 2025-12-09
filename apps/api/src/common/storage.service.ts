import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
    private s3Client: S3Client;
    private readonly bucketName = process.env.AWS_S3_BUCKET;
    private readonly logger = new Logger(StorageService.name);

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            endpoint: process.env.S3_ENDPOINT, // Optional for compatible services
            forcePathStyle: true, // Needed for MinIO/some compatible services
        });
    }

    async getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });
        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }

    async getPresignedDownloadUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }
}
