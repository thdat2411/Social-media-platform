import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const uniqueFileName = `cv/${timestamp}-${file.name}`;
    const upload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", public_id: uniqueFileName },
          (error, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const result = (await upload()) as { secure_url: string };
    if (!result) {
      return NextResponse.json(
        { error: "Error uploading file to Cloudinary." },
        { status: 400 }
      );
    }
    const fileUrl = result.secure_url;
    return NextResponse.json(
      { message: "File uploaded successfully.", url: fileUrl },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error uploading file to Cloudinary." },
      { status: 400 }
    );
  }
}
