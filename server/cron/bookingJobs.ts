import "dotenv/config";
import cron from "node-cron";
import { Resend } from "resend";
import Booking from "../models/Booking.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ceylontrails.com";
const FROM_EMAIL = "CeylonTrails <CeylonTrails@resend.dev>";

async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

// Run daily at 9 AM - Send "trip starts tomorrow" reminders
cron.schedule("0 9 * * *", async () => {
  console.log("Running booking reminder job...");

  try {
    // Find bookings for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const upcomingBookings = await Booking.find({
      date: {
        $gte: tomorrowStart.toISOString().slice(0, 10),
        $lte: tomorrowEnd.toISOString().slice(0, 10),
      },
      status: "confirmed",
    }).populate("user");

    for (const booking of upcomingBookings) {
      try {
        const user = booking.user as any;
        if (user && user.email) {
          await sendEmail(
            user.email,
            "Your Trip Starts Tomorrow - Ceylon Trails",
            `
              <h2>Your Adventure Starts Tomorrow!</h2>
              <p>Dear ${user.firstName},</p>
              <p>We're excited to remind you that your trip <strong>${booking.tourTitle}</strong> starts tomorrow.</p>
              <p><strong>Trip Details:</strong></p>
              <ul>
                <li>Date: ${booking.date}</li>
                <li>Guests: ${booking.guests}</li>
              </ul>
              <p>Please arrive at the meeting point 15 minutes early. Safe travels!</p>
              <p>Ceylon Trails Team</p>
            `,
          );
          console.log(
            `Reminder sent to ${user.email} for booking ${booking._id}`,
          );
        }
      } catch (emailError) {
        console.error(
          `Failed to send reminder for booking ${booking._id}:`,
          emailError,
        );
      }
    }

    console.log("Booking reminder job completed");
  } catch (error) {
    console.error("Error in booking reminder job:", error);
  }
});

// Run daily at 6 PM - Send post-tour "thank you + review" emails
cron.schedule("0 18 * * *", async () => {
  console.log("Running post-tour follow-up job...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find bookings that ended today (tour date has passed)
    const completedBookings = await Booking.find({
      date: { $lt: today.toISOString().slice(0, 10) },
      status: "confirmed",
    }).populate("user");

    for (const booking of completedBookings) {
      try {
        const user = booking.user as any;
        if (user && user.email) {
          // Mark as completed
          booking.status = "completed";
          await booking.save();

          // Send thank you + review request email
          await sendEmail(
            user.email,
            "Thank You for Your Trip! - Ceylon Trails",
            `
              <h2>Thank You for Traveling with Ceylon Trails!</h2>
              <p>Dear ${user.firstName},</p>
              <p>We hope you had an amazing time on your <strong>${booking.tourTitle}</strong> tour!</p>
              <p>Your feedback helps us improve and helps other travelers discover the best experiences in Sri Lanka.</p>
              <p>Please take a moment to share your experience:</p>
              <p>
                <a href="https://ceylontrails.lk/tours/${booking.tourId}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Leave a Review
                </a>
              </p>
              <p>We'd love to hear from you!</p>
              <p>Safe travels,<br>Ceylon Trails Team</p>
            `,
          );
          console.log(
            `Post-tour email sent to ${user.email} for booking ${booking._id}`,
          );
        }
      } catch (emailError) {
        console.error(
          `Failed to send post-tour email for booking ${booking._id}:`,
          emailError,
        );
      }
    }

    console.log("Post-tour follow-up job completed");
  } catch (error) {
    console.error("Error in post-tour follow-up job:", error);
  }
});

console.log("Booking cron jobs initialized");
