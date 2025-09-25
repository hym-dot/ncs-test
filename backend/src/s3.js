import "dotenv/config"; // 1. .env 파일을 읽기 위해 추가
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 2. AWS 인증 정보를 포함하여 S3 클라이언트 설정
export const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// 3. .env 파일에 작성한 정확한 변수 이름을 사용
const Bucket = process.env.AWS_S3_BUCKET;

export const presignPut = (Key, ContentType) =>
    getSignedUrl(
        s3,
        new PutObjectCommand({ Bucket, Key, ContentType }),
        { expiresIn: 300 } // 5분
    );

export const presignGet = (Key, sec = 300) =>
    getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket, Key }),
        { expiresIn: sec }
    );

// 4. 삭제할 파일의 Key를 인자로 받도록 수정
export const deleteObject = (Key) =>
    s3.send(new DeleteObjectCommand({ Bucket, Key }));