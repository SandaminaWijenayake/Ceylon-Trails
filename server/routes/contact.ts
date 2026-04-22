import express, { type Request, type Response } from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ceylontrails.com";

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await resend.emails.send({
      from: "CeylonTrails <CeylonTrails@resend.dev>",
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