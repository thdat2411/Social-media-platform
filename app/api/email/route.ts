// pages/api/send-code.js

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, code } = body;

  // Configure your email transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new NextResponse("Code sent successfully.", { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse("Failed to send email.", { status: 500 });
  }
}
