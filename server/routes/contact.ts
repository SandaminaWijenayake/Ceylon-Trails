import express, { type Request, type Response } from "express";
import nodemailer from "nodemailer";
import { resolve4 } from "node:dns";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  lookup(hostname: string, opts: object, cb: (err: Error | null, address: string, family: number) => void) {
    resolve4(hostname, (err, addresses) => {
      if (err || !addresses?.[0]) cb(err ?? new Error("No IPv4 address"), "", 4);
      else cb(null, addresses[0], 4);
    });
  },
} as any);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ceylontrails.com";

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await transporter.sendMail({
      from: `"Ceylon Trails" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[CeylonTrails] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr />
        <p style="color: #888; font-size: 12px;">This email was sent from the CeylonTrails contact form.</p>
      `,
    });

    res.json({ message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;