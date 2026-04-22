import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Booking } from "./BookingStatusBadge";
import BookingCard from "./BookingCard";

interface BookingListProps {
  bookings: Booking[];
  onCancelClick: (bookingId: string) => void;
  cancellingId: string | null;
}

export default function BookingList({ bookings, onCancelClick, cancellingId }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No bookings found.</p>
        <Link to="/tours">
          <Button className="mt-4">Browse Tours</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          onCancelClick={() => onCancelClick(booking._id)}
          isCancelling={cancellingId === booking._id}
        />
      ))}
    </div>
  );
}