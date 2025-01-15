
import {S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    }
});

// Funtion to get objects(files) from the bucket
export async function getFileUrl(key: string) {
	try {
        const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
    
        const url = await getSignedUrl(s3Client, getObjectCommand, {
            expiresIn: 60 * 60, // 1 hour
        });
        return url;
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

async function deleteObject(key: string) {
    const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: "course-learning-app",
        Key: key,
    });

    const response = await s3Client.send(deleteObjectCommand);
    return response;
}