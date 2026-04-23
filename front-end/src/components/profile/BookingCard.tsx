import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Booking, BookingStatusBadge, getTimeUntilDeadline } from "./BookingStatusBadge";

interface BookingCardProps {
  booking: Booking;
  onCancelClick: () => void;
  isCancelling: boolean;
}

export default function BookingCard({ booking, onCancelClick, isCancelling }: BookingCardProps) {
  const timeLeft = getTimeUntilDeadline(booking.cancellationDeadline, booking.status);
  const canCancel = booking.status === "confirmed";

  return (
    <div className="bg-card border border-border/60 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-muted/60 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{booking.tourTitle}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {booking.date} · {booking.guests} guest{booking.guests > 1 ? "s" : ""} · ${booking.total}
          </p>
          {timeLeft && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Free cancellation: {timeLeft} remaining
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <BookingStatusBadge status={booking.status} />
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelClick}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel"}
          </Button>
        )}
      </div>
    </div>
  );
}