import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booking, getTimeUntilDeadline } from "./BookingStatusBadge";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

export function CancelBookingModal({
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
}: CancelBookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-card border border-border/60 rounded-3xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Cancel Booking</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to cancel your booking?
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}