export interface Booking {
  _id: string;
  tourId: string;
  tourTitle: string;
  date: string;
  guests: number;
  total: number;
  status: "confirmed" | "cancelled" | "expired" | "completed";
  cancellationDeadline: string;
  cancelledAt?: string;
  cancellationFee?: number;
  refundAmount?: number;
  createdAt: string;
}

export function BookingStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
          Confirmed
        </span>
      );
    case "cancelled":
      return (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    case "expired":
      return (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800">
          Expired
        </span>
      );
    case "completed":
      return (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
          Completed
        </span>
      );
    default:
      return (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
}

export function getTimeUntilDeadline(deadline: string, status: string) {
  if (status !== "confirmed") return null;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}