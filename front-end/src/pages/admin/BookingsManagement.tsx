import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [bookingsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allBookings = bookingsRes.data.bookings || [];
      const users = usersRes.data.users || [];

      const userMap: Record<string, any> = {};
      users.forEach((u) => {
        userMap[u._id] = u;
      });

      const enhancedBookings = allBookings.map((b) => ({
        ...b,
        userId: userMap[b.user] || { firstName: "", lastName: "", email: "" },
      }));

      setBookings(enhancedBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_BASE}/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}.`,
      });
      fetchBookings();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading bookings...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60 bg-muted/30">
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                  Tour
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-foreground">
                    {b.userId?.firstName && b.userId?.lastName
                      ? `${b.userId.firstName} ${b.userId.lastName}`
                      : "Unknown"}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {b.userId?.email || "N/A"}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell max-w-[200px] truncate text-muted-foreground">
                    {b.tourTitle}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{b.date}</td>
                  <td className="px-5 py-4">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        updateBookingStatus(b._id, e.target.value)
                      }
                      disabled={updatingId === b._id}
                      className="text-xs px-2 py-1 rounded border border-border/40 bg-background"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-xs text-muted-foreground">
                      ${b.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}