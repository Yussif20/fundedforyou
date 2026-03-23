// import * as Minio from "minio";
// import { nanoid } from "nanoid";

// export const minioClient = new Minio.Client({
//   endPoint: process.env.MI_SPACE_ENDPOINT || "",
//   port: 9000,
//   useSSL: false,
//   accessKey: process.env.MI_SPACE_ACCESS_KEY,
//   secretKey: process.env.MI_SPACE_SECRET_KEY,
// });

// // --------------------- Types ---------------------
// export type MulterFile = Express.Multer.File;
// export type MulterFileInput<T extends MulterFile | MulterFile[]> =
//   T extends MulterFile[] ? MulterFile[] : MulterFile;

// // --------------------- Upload ---------------------
// export const uploadToMinIO = async <T extends MulterFile | MulterFile[]>(
//   files: T,
//   folder: string = "minemio",
//   teamName: string = "binary"
// ): Promise<T extends MulterFile[] ? string[] : string> => {
//   const filesArray = Array.isArray(files) ? files : [files];
//   const bucketName = process.env.MI_SPACE_BUCKET || "";

//   // Check if bucket exists
//   const bucketExists = await minioClient.bucketExists(bucketName);
//   if (!bucketExists) {
//     await minioClient.makeBucket(bucketName, "us-east-1");
//   }

//   const uploadedUrls: string[] = [];

//   for (const file of filesArray) {
//     try {
//       const fileName = `${teamName}/${folder}/${file.originalname.split(/\.(?=[^\.]+$)/)[0]}-${nanoid(6)}.${file.originalname.split(".").pop()}`;

//       const metaData = {
//         "Content-Type": file.mimetype,
//         "Content-Disposition": "inline",
//         "Cache-Control": "public, max-age=31536000",
//       };

//       await minioClient.putObject(
//         bucketName,
//         fileName,
//         file.buffer,
//         file.size,
//         metaData
//       );

//       const endpoint = process.env.MI_SPACE_ENDPOINT;
//       const port =
//         process.env.MI_SPACE_SSL === "true"
//           ? `:${process.env.MI_SPACE_PORT}`
//           : "";
//       const protocol = process.env.MI_SPACE_SSL === "true" ? "https" : "http";

//       uploadedUrls.push(
//         `${protocol}://${endpoint}${port}/${bucketName}/${fileName}`
//       );
//     } catch (error) {
//       console.error(`Error uploading file: ${file?.originalname}`, error);
//       throw new Error(`Failed to upload file: ${file?.originalname}`);
//     }
//   }

//   // Return type based on input
//   return (Array.isArray(files) ? uploadedUrls : uploadedUrls[0]) as any;
// };

// // --------------------- Delete ---------------------
// export const deleteFromMinIO = async (
//   fileInput: string | string[]
// ): Promise<void> => {
//   const files = Array.isArray(fileInput) ? fileInput : [fileInput];
//   const bucketName = process.env.MI_SPACE_BUCKET || "";

//   for (const fileUrl of files) {
//     try {
//       if (!fileUrl) return;
//       const url = new URL(fileUrl);
//       const pathParts = url.pathname.split("/"); // ['', 'bucketName', 'folder', ...]
//       const fileName = pathParts.slice(2).join("/"); // remove bucket name

//       await minioClient.removeObject(bucketName, fileName);
//     } catch (error: any) {
//       console.error(`Error deleting file: ${fileUrl}`, error);
//     }
//   }
// };

/* eslint-disable no-console */
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import path from "path";

// --------------------- Types ---------------------
export type MulterFile = Express.Multer.File;
export type MulterFileInput<T extends MulterFile | MulterFile[]> =
  T extends MulterFile[] ? MulterFile[] : MulterFile;

// --------------------- DigitalOcean Client ---------------------
const s3Client = new S3Client({
  region: "sfo3", // can be anything, DO ignores this
  endpoint: process.env.DO_SPACE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY || "",
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY || "",
  },
});

const bucketName = process.env.DO_SPACE_BUCKET || "";

// --------------------- Upload (SAME NAME) ---------------------
export const uploadToMinIO = async <T extends MulterFile | MulterFile[]>(
  files: T,
  folder: string = "uploads",
  teamName: string = "hasanchami",
): Promise<T extends MulterFile[] ? string[] : string> => {
  const filesArray = Array.isArray(files) ? files : [files];
  const uploadedUrls: string[] = [];

  for (const file of filesArray) {
    try {
      if (!file || !file.originalname) {
        throw new Error("Invalid file");
      }

      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);

      const fileName = `${teamName}/${folder}/${baseName}-${nanoid(6)}${ext}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
        CacheControl: "public, max-age=31536000",
        ContentDisposition: "inline",
      });

      await s3Client.send(command);

      const publicUrl = `${process.env.DO_SPACE_ENDPOINT}/${bucketName}/${fileName}`;
      uploadedUrls.push(publicUrl);
    } catch (error) {
      console.error(`Error uploading file: ${file?.originalname}`, error);
      throw new Error(`Failed to upload file: ${file?.originalname}`);
    }
  }

  return (Array.isArray(files) ? uploadedUrls : uploadedUrls[0]) as any;
};

// --------------------- Delete (SAME NAME) ---------------------
export const deleteFromMinIO = async (
  fileInput: string | string[],
): Promise<void> => {
  const files = Array.isArray(fileInput) ? fileInput : [fileInput];

  for (const fileUrl of files) {
    try {
      if (!fileUrl) continue;

      const key = fileUrl.replace(
        `${process.env.DO_SPACE_ENDPOINT}/${bucketName}/`,
        "",
      );

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error: any) {
      console.error(`Error deleting file: ${fileUrl}`, error);
    }
  }
};
