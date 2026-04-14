import { CheckCircle, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BookingState {
  booking?: {
    _id?: string;
    tourTitle?: string;
    date?: string;
    guests?: number;
    total?: number;
  };
}

export default function BookingConfirmation() {
  const location = useLocation();
  const state = location.state as BookingState | null;
  const booking = state?.booking;

  const bookingInfo = booking
    ? [
        { label: "Booking ID", value: booking._id ?? "--" },
        { label: "Tour", value: booking.tourTitle ?? "--" },
        { label: "Date", value: booking.date ?? "--" },
        { label: "Guests", value: booking.guests?.toString() ?? "--" },
      ]
    : [
        { label: "Booking ID", value: "BK-2853" },
        { label: "Tour", value: "Nine Arches Bridge Railway Adventure" },
        { label: "Date", value: "April 28, 2026" },
        { label: "Guests", value: "2" },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container-travel py-24 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Booking Confirmed
          </h1>
          <p className="text-muted-foreground mb-12 text-pretty leading-relaxed">
            Your adventure awaits. We've sent a confirmation email with all the
            details. You can also view your booking anytime from your profile.
          </p>

          <div className="bg-card border border-border/60 rounded-lg p-7 text-left mb-10 space-y-4">
            {bookingInfo.map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm border-t border-border/40 pt-4 font-semibold">
              <span>Total Paid</span>
              <span className="text-accent">${booking?.total ?? 187}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="default" className="flex-1" asChild>
              <Link to="/profile">View My Bookings</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/tours">
                Explore More Tours <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
