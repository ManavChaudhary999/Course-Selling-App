
import {S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    }
});

export async function GetFileUrl(key: string) {
	try {
        const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
    
        const url = await getSignedUrl(s3Client, getObjectCommand, {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
        });
        return url;
    } catch (error) {
        throw error;
    }
}

export async function GetFileUrls(fileKeys: string[],) {
	try {
        if(fileKeys.length === 0) return {};

        const urls: Record<string, string> = {};

        const presignedUrls = fileKeys.map(async (key) => {
            
            const getObjectCommand = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
            });

            const url = await getSignedUrl(s3Client, getObjectCommand, {
                expiresIn: 60 * 60 * 24 * 7, // 7 days
            });

            urls[key] = url;
        })

        await Promise.all(presignedUrls);
    
        return urls;
    } catch (error) {
        throw error;
    }
}

async function GetPresignedUploadUrl(fileName: string, fileType: string) {
    try {
        const key = `${Date.now()}-${fileName}`;
        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
            // ACL: 'public-read'
        });
    
        const url = await getSignedUrl(s3Client, putObjectCommand, {
            expiresIn: 60 * 60, // 1 hour
        });
    
        return url;
    } catch (error) {
        throw error;
    }
}

export async function GetThumbnailUploadUrl(courseId: string, fileName: string, fileType: string) {
    const key = `course-${courseId}-thumbnail-${fileName}`;
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(fileType)) throw new Error('Invalid file type');

    return {
        publicId: `${Date.now()}-${key}`,
        url: await GetPresignedUploadUrl(key, fileType)
    }
}

export async function GetLectureUploadUrl(courseId: string, lectureId: string, fileName: string, fileType: string) {
    const key = `lecture-${lectureId}-${fileName}`;
    if (!['video/mp4', 'video/webm', 'video/mkv'].includes(fileType)) throw new Error('Invalid file type');

    return {
        publicId: `${Date.now()}-${key}`,
        url: await GetPresignedUploadUrl(key, fileType)
    }
}

export async function GetProfileUploadUrl(userId: string, fileName: string, fileType: string) {
    const key = `user-${userId}-profile-${fileName}`;
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(fileType)) throw new Error('Invalid file type');

    return {
        publicId: `${Date.now()}-${key}`,
        url: await GetPresignedUploadUrl(key, fileType)
    }
}

export async function DeleteFile(key: string) {
    try {
        const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
    
        const response = await s3Client.send(deleteObjectCommand);
        return response;
    } catch (error) {
        throw error;
    }
}