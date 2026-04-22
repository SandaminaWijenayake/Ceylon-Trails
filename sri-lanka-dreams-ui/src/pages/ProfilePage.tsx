import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Heart,
  Calendar,
  Clock,
  X,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";

interface Booking {
  _id: string;
  tourId: string;
  tourTitle: string;
  date: string;
  guests: number;
  total: number;
  status: "confirmed" | "cancelled" | "expired";
  cancellationDeadline: string;
  cancelledAt?: string;
  cancellationFee?: number;
  refundAmount?: number;
  createdAt: string;
}

interface SavedTour {
  _id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  tourPrice: number;
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}

export default function ProfilePage() {
  const [realBookings, setRealBookings] = useState<Booking[]>([]);
  const [savedTours, setSavedTours] = useState<SavedTour[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(
    null,
  );
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [removingTourId, setRemovingTourId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE}/assets/tours/${imagePath}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const [bookingsRes, wishlistRes, profileRes] = await Promise.all([
        axios.get(`${API_BASE}/bookings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/wishlist/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRealBookings(bookingsRes.data.bookings);
      setSavedTours(wishlistRes.data.wishlists);
      setUserData(profileRes.data.user);
      setEditFirstName(profileRes.data.user.firstName);
      setEditLastName(profileRes.data.user.lastName);
      setEditEmail(profileRes.data.user.email);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      if (error?.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        navigate("/login");
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to load your profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdatingProfile(true);
    try {
      const token = localStorage.getItem("authToken");
      const updateData: any = {
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
      };

      // Only include password if it's not empty
      if (editPassword.trim()) {
        updateData.password = editPassword;
      }

      const response = await axios.put(`${API_BASE}/auth/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data.user);
      localStorage.setItem(
        "userName",
        `${response.data.user.firstName} ${response.data.user.lastName}`,
      );

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setShowEditProfile(false);
      setEditPassword(""); // Clear password field
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error.response?.data?.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${API_BASE}/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRealBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? response.data.booking : b)),
      );

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Cancellation failed",
        description:
          error.response?.data?.message || "Failed to cancel booking.",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
      setShowCancelConfirm(null);
    }
  };

  const handleRemoveFromWishlist = async (tourId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingTourId(tourId);
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_BASE}/wishlist/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedTours((prev) => prev.filter((t) => t.tourId !== tourId));
      toast({
        title: "Removed from saved",
        description: "Tour removed from your saved tours.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove tour.",
        variant: "destructive",
      });
    } finally {
      setRemovingTourId(null);
    }
  };

  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getTimeUntilDeadline = (deadline: string, status: string) => {
    if (status !== "confirmed") return null;

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-travel py-16">
          <div className="text-center">Loading your profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container-travel py-16">
        {/* User info */}
        <div className="bg-card border border-border/60 rounded-lg p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-14">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
            {userData?.firstName?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {userData ? `${userData.firstName} ${userData.lastName}` : "User"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {userData?.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {realBookings.length} bookings
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowEditProfile(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setShowEditProfile(false)}
            />
            <div className="relative z-10 w-full max-w-md bg-card border border-border/60 rounded-3xl p-6 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="rounded-full p-1 hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
                    New Password (leave empty to keep current)
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  className="flex-1"
                  onClick={handleUpdateProfile}
                  disabled={updatingProfile}
                >
                  {updatingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Booking History */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            My Bookings
          </h2>
          {realBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings found.</p>
              <Link to="/tours">
                <Button className="mt-4">Browse Tours</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {realBookings.map((booking) => {
                const timeLeft = getTimeUntilDeadline(
                  booking.cancellationDeadline,
                  booking.status,
                );
                const canCancel = booking.status === "confirmed";

                return (
                  <div
                    key={booking._id}
                    className="bg-card border border-border/60 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-muted/60 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {booking.tourTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {booking.date} · {booking.guests} guest
                          {booking.guests > 1 ? "s" : ""} · ${booking.total}
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
                      {getStatusBadge(booking.status)}
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCancelConfirm(booking._id)}
                          disabled={cancellingId === booking._id}
                        >
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </Button>
                      )}
                    </div>

                    {/* Cancel Confirmation Modal */}
                    {showCancelConfirm === booking._id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
                          onClick={() => setShowCancelConfirm(null)}
                        />
                        <div className="relative z-10 w-full max-w-md bg-card border border-border/60 rounded-3xl p-6 shadow-xl">
                          <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-500 mt-0.5" />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                Cancel Booking
                              </h3>
                              <p className="text-sm text-muted-foreground mt-2">
                                Are you sure you want to cancel your booking for{" "}
                                <strong>{booking.tourTitle}</strong>?
                              </p>
                              <div className="mt-4 p-3 bg-muted/60 rounded-lg">
                                <p className="text-sm">
                                  <strong>Original Amount:</strong> $
                                  {booking.total}
                                </p>
                                <p className="text-sm">
                                  <strong>Cancellation Fee:</strong>{" "}
                                  {timeLeft
                                    ? "$0 (free)"
                                    : `$${Math.round(booking.total * 0.2)} (20%)`}
                                </p>
                                <p className="text-sm">
                                  <strong>Refund Amount:</strong>{" "}
                                  {timeLeft
                                    ? `$${booking.total}`
                                    : `$${booking.total - Math.round(booking.total * 0.2)}`}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowCancelConfirm(null)}
                              className="rounded-full p-1 hover:bg-muted transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-6 flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowCancelConfirm(null)}
                            >
                              Keep Booking
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={cancellingId === booking._id}
                            >
                              {cancellingId === booking._id
                                ? "Cancelling..."
                                : "Cancel Booking"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Saved Tours */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Saved Tours
          </h2>
          {savedTours.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No saved tours yet.</p>
              <Link to="/tours">
                <Button className="mt-4">Explore Tours</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {savedTours.map((tour) => (
                <div key={tour._id} className="group relative bg-card border border-border/60 rounded-lg overflow-hidden hover:shadow-md transition-all duration-500">
                  <Link
                    to={`/tours/${tour.tourId}`}
                    className="block"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={getImageUrl(tour.tourImage)}
                        alt={tour.tourTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <button
                        onClick={(e) => handleRemoveFromWishlist(tour.tourId, e)}
                        disabled={removingTourId === tour.tourId}
                        className="absolute top-3 right-3 p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors disabled:opacity-50"
                      >
                        <Heart className="w-5 h-5 fill-accent text-accent" />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 mb-3">
                        {tour.tourTitle}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          from
                        </span>
                        <span className="font-semibold text-foreground text-sm">
                          ${tour.tourPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
