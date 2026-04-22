import { useState, useEffect } from "react";
import { Edit, Calendar, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditProfileModal from "@/components/profile/EditProfileModal";
import BookingList from "@/components/profile/BookingList";
import SavedToursSection from "@/components/profile/SavedToursSection";
import { CancelBookingModal } from "@/components/profile/CancelBookingModal";
import { Booking } from "@/components/profile/BookingStatusBadge";
import axios from "axios";

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
      setEditPassword("");
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

  const handleRemoveFromWishlist = async (tourId: string) => {
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

        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          firstName={editFirstName}
          lastName={editLastName}
          email={editEmail}
          password={editPassword}
          onFirstNameChange={setEditFirstName}
          onLastNameChange={setEditLastName}
          onEmailChange={setEditEmail}
          onPasswordChange={setEditPassword}
          onSave={handleUpdateProfile}
          isSaving={updatingProfile}
        />

        <CancelBookingModal
          isOpen={!!showCancelConfirm}
          onClose={() => setShowCancelConfirm(null)}
          onConfirm={() =>
            showCancelConfirm && handleCancelBooking(showCancelConfirm)
          }
          isCancelling={!!cancellingId}
        />

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            My Bookings
          </h2>
          <BookingList
            bookings={realBookings}
            onCancelClick={(id) => setShowCancelConfirm(id)}
            cancellingId={cancellingId}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Saved Tours
          </h2>
          <SavedToursSection
            tours={savedTours}
            onRemove={handleRemoveFromWishlist}
            isRemoving={removingTourId}
          />
        </section>
      </div>
      <Footer />
    </div>
  );
}
