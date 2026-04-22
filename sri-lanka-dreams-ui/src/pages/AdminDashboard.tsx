import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  Users,
  Bell,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  UserCheck,
  Activity,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { log } from "console";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Tours", icon: Map, path: "/admin/tours" },
  { label: "Bookings", icon: CalendarCheck, path: "/admin/bookings" },
  { label: "Users", icon: Users, path: "/admin/users" },
];

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// Helper to get full image URL
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE}/assets/tours/${imagePath}`;
};

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userName = localStorage.getItem("userName") || "Admin";
  console.log("User Name:", userName);
  const userInitials = userName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`${mobile ? "w-64 h-full" : sidebarOpen ? "w-64" : "w-16"} bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 shrink-0`}
    >
      <div className="h-[72px] flex items-center px-5 gap-3 border-b border-sidebar-border">
        {(sidebarOpen || mobile) && (
          <Link to="/" className="flex items-center gap-3">
            <span className="font-display font-bold text-lg tracking-tight">
              Ceylon<span className="text-sidebar-primary">Trails</span>
            </span>
          </Link>
        )}
      </div>
      <nav className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileSidebar(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {(sidebarOpen || mobile) && (
                <span className="tracking-wide">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {mobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-foreground/20"
            onClick={() => setMobileSidebar(false)}
          />
          <div className="relative z-10 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] border-b border-border/60 bg-card flex items-center justify-between px-5 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileSidebar(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              className="hidden lg:block"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                {userInitials}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {userName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Logout"
            >
              <LogOut className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function OverviewPage() {
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

      // Create user map for lookup
      const userMap = {};
      users.forEach((u) => {
        userMap[u._id] = u;
      });

      // Enhance bookings with user data
      const enhancedBookings = bookings.map((b) => ({
        ...b,
        userId: userMap[b.user] || { firstName: "", lastName: "", email: "" },
      }));

      // Calculate stats
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

      // Compute top booked tours
      const tourBookingCounts = {};
      enhancedBookings.forEach((b) => {
        if (b.tourTitle) {
          tourBookingCounts[b.tourTitle] =
            (tourBookingCounts[b.tourTitle] || 0) + 1;
        }
      });
      // Map tourTitle to tour object
      const tourMap = {};
      tours.forEach((t) => {
        tourMap[t.title] = t;
      });
      // Create array of tours with booking count
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

function ToursManagement() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    rating: "",
    reviewCount: "",
    duration: "",
    type: "",
    groupType: "",
    includes: "",
    images: [],
    description: "",
    status: "active",
  });
  const { toast } = useToast();
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE}/tours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTours(response.data.tours);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      toast({
        title: "Error",
        description: "Failed to load tours.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteOldImages = async (imagePaths: string[]) => {
    const token = localStorage.getItem("authToken");
    console.log("Deleting old images:", imagePaths);
    // Delete the old images from the assets folder
    for (const imagePath of imagePaths) {
      try {
        console.log(`Deleting image: ${imagePath}`);
        await axios.delete(`${API_BASE}/tours/delete-image/${imagePath}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`Deleted image: ${imagePath}`);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const uploadImages = async () => {
    if (selectedFiles.length !== 4) {
      throw new Error("Please select exactly 4 images");
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formDataUpload = new FormData();

      // Upload the new images FIRST
      selectedFiles.forEach((file) => {
        formDataUpload.append("images", file);
      });

      const response = await axios.post(
        `${API_BASE}/tours/upload-images`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const newImagePaths = response.data.imagePaths;

      // Only delete old images AFTER successful upload
      const existingImagePaths = editingTour?.images || [];
      if (existingImagePaths.length > 0) {
        await deleteOldImages(existingImagePaths);
      }

      return newImagePaths;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      let imagePaths = formData.images;

      if (selectedFiles.length > 0) {
        imagePaths = await uploadImages();
      }

      const tourData = {
        ...formData,
        images: imagePaths,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
        includes: formData.includes
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };

      if (editingTour) {
        await axios.put(`${API_BASE}/tours/${editingTour._id}`, tourData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({
          title: "Success",
          description: "Tour updated successfully.",
        });
      } else {
        await axios.post(`${API_BASE}/tours`, tourData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({
          title: "Success",
          description: "Tour created successfully.",
        });
      }

      setShowModal(false);
      setEditingTour(null);
      resetForm();
      fetchTours();
    } catch (error) {
      console.error("Failed to save tour:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to save tour.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      location: tour.location,
      price: tour.price.toString(),
      rating: tour.rating.toString(),
      reviewCount: tour.reviewCount.toString(),
      duration: tour.duration,
      type: tour.type,
      groupType: tour.groupType,
      includes: tour.includes.join(", "),
      images: tour.images || [],
      description: tour.description,
      status: tour.status,
    });
    setShowModal(true);
  };

  const handleCopy = (tour) => {
    setFormData({
      title: `${tour.title} (Copy)`,
      location: tour.location,
      price: tour.price.toString(),
      rating: tour.rating.toString(),
      reviewCount: tour.reviewCount.toString(),
      duration: tour.duration,
      type: tour.type,
      groupType: tour.groupType,
      includes: tour.includes.join(", "),
      images: tour.images || [],
      description: tour.description,
      status: tour.status,
    });
    setShowModal(true);
  };

  const toggleTourStatus = async (tourId: string, currentStatus: string) => {
    const token = localStorage.getItem("authToken");
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await axios.put(
        `${API_BASE}/tours/${tourId}`,
        { ...{ status: newStatus } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast({
        title: "Success",
        description: `Tour status changed to ${newStatus}.`,
      });
      fetchTours();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tour status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (tourId) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${API_BASE}/tours/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Success",
        description: "Tour deleted successfully.",
      });
      fetchTours();
    } catch (error) {
      console.error("Failed to delete tour:", error);
      toast({
        title: "Error",
        description: "Failed to delete tour.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      price: "",
      rating: "",
      reviewCount: "",
      duration: "",
      type: "",
      groupType: "",
      includes: "",
      images: [],
      description: "",
      status: "active",
    });
    setSelectedFiles([]);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTour(null);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-12">Loading tours...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tour Management</h1>
        <Button variant="accent" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Tour
        </Button>
      </div>

      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60 bg-muted/30">
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Tour
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Location
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Price
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tours.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(t.images?.[0] || "")}
                        alt={t.title}
                        className="w-10 h-10 rounded-md object-cover shrink-0"
                      />
                      <span className="font-medium text-foreground line-clamp-1">
                        {t.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {t.location}
                  </td>
                  <td className="px-5 py-4 font-medium tabular-nums">
                    ${t.price}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleTourStatus(t._id, t.status)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        t.status === "active"
                          ? "bg-accent/10 text-accent hover:bg-accent/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Eye className="w-3 h-3" /> {t.status}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleCopy(t)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-card border border-border/60 rounded-lg p-7 w-full max-w-lg shadow-xl space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground font-display">
                {editingTour ? "Edit Tour" : "Add New Tour"}
              </h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ModalField
                label="Title"
                placeholder="Tour name"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <ModalField
                  label="Location"
                  placeholder="City"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
                <ModalField
                  label="Price ($)"
                  placeholder="0"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ModalField
                  label="Rating"
                  placeholder="4.5"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  required
                />
                <ModalField
                  label="Review Count"
                  placeholder="100"
                  type="number"
                  value={formData.reviewCount}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewCount: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ModalField
                  label="Duration"
                  placeholder="e.g., 2-3 days"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
                <ModalField
                  label="Type"
                  placeholder="Adventure"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                />
              </div>
              <ModalField
                label="Group Type"
                placeholder="Family"
                value={formData.groupType}
                onChange={(e) =>
                  setFormData({ ...formData, groupType: e.target.value })
                }
                required
              />
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
                  Tour Images (Select 4 images)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedFiles(Array.from(e.target.files || []))
                  }
                  className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  required={!editingTour || selectedFiles.length === 0}
                />
                {selectedFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedFiles.length} file(s) selected
                  </p>
                )}
                {editingTour &&
                  formData.images.length > 0 &&
                  selectedFiles.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current images will be kept. Select new files to replace.
                    </p>
                  )}
              </div>
              <ModalField
                label="Includes (comma-separated)"
                placeholder="Transport, Guide, Meals"
                value={formData.includes}
                onChange={(e) =>
                  setFormData({ ...formData, includes: e.target.value })
                }
                required
              />
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                  placeholder="Tour description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
                  Status
                </label>
                <select
                  className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent" className="flex-1">
                  {editingTour ? "Update Tour" : "Save Tour"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

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

      // Create user map for lookup
      const userMap = {};
      users.forEach((u) => {
        userMap[u._id] = u;
      });

      // Enhance bookings with user data
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

  const updateBookingStatus = async (bookingId, newStatus) => {
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
      fetchBookings(); // Refresh the list
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

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_BASE}/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast({
        title: "Success",
        description: `User role changed to ${newRole}.`,
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change user role.",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${API_BASE}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">User Management</h1>
      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60 bg-muted/30">
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  User
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">
                  Role
                </th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                        {u.firstName.charAt(0)}
                        {u.lastName.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">
                    {u.email}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u._id, e.target.value)}
                      className="text-xs px-2 py-1 rounded border border-border/40 bg-background"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
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

function StatusBadge({
  status,
}: {
  status: "confirmed" | "pending" | "cancelled";
}) {
  const styles = {
    confirmed: "bg-accent/10 text-accent",
    pending: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ModalField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

export function AdminOverview() {
  return (
    <AdminLayout>
      <OverviewPage />
    </AdminLayout>
  );
}
export function AdminTours() {
  return (
    <AdminLayout>
      <ToursManagement />
    </AdminLayout>
  );
}
export function AdminBookings() {
  return (
    <AdminLayout>
      <BookingsManagement />
    </AdminLayout>
  );
}
export function AdminUsers() {
  return (
    <AdminLayout>
      <UsersManagement />
    </AdminLayout>
  );
}
