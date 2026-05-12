import express, { type Request, type Response } from "express";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ceylontrails.com";

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Ceylon Trails", email: process.env.BREVO_SENDER_EMAIL! },
        to: [{ email: ADMIN_EMAIL }],
        replyTo: { email },
        subject: `[CeylonTrails] ${subject}`,
        htmlContent: `
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
      }),
    });

    res.json({ message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;