import express, { type Request, type Response } from "express";
import { Resend } from "resend";
import { ContactEmail } from "../emails/ContactEmail.js";
import { render } from "@react-email/components";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailHtml = await render(
      ContactEmail({ name, email, subject, message }),
    );

    await resend.emails.send({
      from: "CeylonTrails@resend.dev",
      to: "sandaminawijenayake0717@gmail.com",
      replyTo: email,
      subject: `[CeylonTrails] ${subject}`,
      html: emailHtml,
    });

    res.json({ message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
