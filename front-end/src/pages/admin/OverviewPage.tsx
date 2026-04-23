import { useState, useEffect } from "react";
import axios from "axios";
import { CalendarCheck, DollarSign, UserCheck, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/admin/StatusBadge";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    completedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [bookingsRes, usersRes, toursRes] = await Promise.all([
        axios.get(`${API_BASE}/bookings/all`, { headers }),
        axios.get(`${API_BASE}/users/all`, { headers }),
        axios.get(`${API_BASE}/tours`, { headers }),
      ]);

      const bookings = bookingsRes.data.bookings || [];
      const users = usersRes.data.users || [];
      const tours = toursRes.data.tours || [];

      const userMap: Record<string, any> = {};
      users.forEach((u) => {
        userMap[u._id] = u;
      });

      const enhancedBookings = bookings.map((b) => ({
        ...b,
        userId: userMap[b.user] || { firstName: "", lastName: "", email: "" },
      }));

      const totalRevenue = enhancedBookings.reduce(
        (sum, b) => sum + (b.total || 0),
        0,
      );
      const completedBookings = enhancedBookings.filter(
        (b) => b.status === "completed",
      ).length;

      setStats({
        totalBookings: enhancedBookings.length,
        totalRevenue: Math.round(totalRevenue),
        activeUsers: users.length,
        completedBookings: completedBookings,
      });

      setRecentBookings(enhancedBookings.slice(0, 5));

      const tourBookingCounts: Record<string, number> = {};
      enhancedBookings.forEach((b) => {
        if (b.tourTitle) {
          tourBookingCounts[b.tourTitle] =
            (tourBookingCounts[b.tourTitle] || 0) + 1;
        }
      });
      const tourMap: Record<string, any> = {};
      tours.forEach((t) => {
        tourMap[t.title] = t;
      });
      const topToursArr = Object.entries(tourBookingCounts)
        .map(([title, count]) => ({
          ...(tourMap[title] || { title, price: 0, _id: title }),
          bookingCount: count,
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);
      setTopTours(topToursArr);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  const statsArray = [
    {
      label: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: CalendarCheck,
      color: "text-accent",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-accent",
    },
    {
      label: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: UserCheck,
      color: "text-accent",
    },
    {
      label: "Completed Bookings",
      value: stats.completedBookings.toLocaleString(),
      icon: Activity,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsArray.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border/60 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {s.label}
              </span>
              <s.icon className={`w-[18px] h-[18px] ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/60 rounded-lg p-7">
          <h3 className="font-display font-semibold text-foreground text-lg mb-5">
            Top Booked Tours
          </h3>
          <div className="space-y-3">
            {topTours.length > 0 ? (
              topTours.map((tour, idx) => (
                <div
                  key={tour._id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-foreground line-clamp-1">
                      {tour.title}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-accent">
                    ${tour.price}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No tours yet
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-lg p-7">
          <h3 className="font-display font-semibold text-foreground text-lg mb-5">
            Booking Status
          </h3>
          <div className="space-y-3">
            {recentBookings.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Confirmed
                  </span>
                  <span className="font-semibold">
                    {
                      recentBookings.filter((b) => b.status === "confirmed")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-semibold">
                    {
                      recentBookings.filter((b) => b.status === "pending")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                  <span className="font-semibold">
                    {
                      recentBookings.filter((b) => b.status === "completed")
                        .length
                    }
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No bookings yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-lg p-7">
        <h3 className="font-display font-semibold text-foreground text-lg mb-5">
          Recent Bookings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60">
                <th className="pb-4 font-medium text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                  Tour
                </th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 font-medium text-foreground">
                    {b.userId?.firstName && b.userId?.lastName
                      ? `${b.userId.firstName} ${b.userId.lastName}`
                      : "Guest"}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {b.userId?.email || "N/A"}
                  </td>
                  <td className="py-4 hidden sm:table-cell max-w-[200px] truncate text-muted-foreground">
                    {b.tourTitle || "N/A"}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-4 text-right font-medium tabular-nums">
                    ${b.total}
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