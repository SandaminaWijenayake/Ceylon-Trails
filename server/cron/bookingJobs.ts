import cron from "node-cron";
import sgMail from "@sendgrid/mail";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running booking cleanup and reminder jobs...");

  try {
    const now = new Date();

    // 1. Send "trip starts tomorrow" reminders
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
          const msg = {
            to: user.email,
            from: "noreply@ceylontrails.com",
            subject: "Your Trip Starts Tomorrow - Ceylon Trails",
            html: `
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
          };
          await sgMail.send(msg);
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

    // 2. Mark expired bookings (though we don't have pending status anymore, keeping for future use)
    // This would be for any bookings that might need expiration logic

    console.log("Booking jobs completed");
  } catch (error) {
    console.error("Error in booking cron job:", error);
  }
});

// Run every 6 hours to check for admin cancellations and notify users
cron.schedule("0 */6 * * *", async () => {
  console.log("Checking for admin cancellations...");

  try {
    // Find recently cancelled bookings (within last 6 hours)
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    const recentCancellations = await Booking.find({
      status: "cancelled",
      cancelledAt: { $gte: sixHoursAgo },
    }).populate("user");

    for (const booking of recentCancellations) {
      try {
        const user = booking.user as any;
        if (user && user.email && booking.cancellationFee !== undefined) {
          // Only send if this is an admin cancellation (we'll need to track this)
          // For now, sending for all cancellations as per requirements
          const msg = {
            to: user.email,
            from: "noreply@ceylontrails.com",
            subject: "Booking Status Update - Ceylon Trails",
            html: `
              <h2>Booking Status Update</h2>
              <p>Dear ${user.firstName},</p>
              <p>Your booking for <strong>${booking.tourTitle}</strong> has been cancelled.</p>
              <p><strong>Cancellation Details:</strong></p>
              <ul>
                <li>Original Amount: $${booking.total}</li>
                <li>Cancellation Fee: $${booking.cancellationFee}</li>
                <li>Refund Amount: $${booking.refundAmount}</li>
              </ul>
              <p>If you have any questions, please contact our support team.</p>
            `,
          };
          await sgMail.send(msg);
          console.log(`Cancellation notification sent to ${user.email}`);
        }
      } catch (emailError) {
        console.error(`Failed to send cancellation notification:`, emailError);
      }
    }

    console.log("Admin cancellation check completed");
  } catch (error) {
    console.error("Error in admin cancellation check:", error);
  }
});

console.log("Booking cron jobs initialized");
