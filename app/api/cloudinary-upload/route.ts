import getCurrentUser from "@/app/actions/getCurrentUser";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // Check the "type" parameter from the request URL
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const folderPath = `${user.id}/${type === "raw" ? "cv" : "images"}`;
  const uniqueFileName = `${folderPath}/${timestamp}-${file.name}`;

  // Upload function using Cloudinary's upload_stream API
  const uploadToCloudinary = (resourceType: "raw" | "image") => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, public_id: uniqueFileName },
        (error, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });
  };

  try {
    const result = (await uploadToCloudinary(type === "raw" ? "raw" : "image")) as UploadApiResponse;

    if (!result.secure_url) {
      return NextResponse.json(
        { error: "Error uploading file to Cloudinary." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "File uploaded successfully.",
        url: result.secure_url,
        folder: folderPath, // Provide the folder path in the response
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "An error occurred during the upload process." },
      { status: 500 }
    );
  }
}
