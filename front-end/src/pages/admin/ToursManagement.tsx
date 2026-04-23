import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/components/admin/adminConfig";
import { ModalField } from "@/components/admin/ModalField";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function ToursManagement() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    images: [] as string[],
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
    for (const imagePath of imagePaths) {
      try {
        await axios.delete(`${API_BASE}/tours/delete-image/${imagePath}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

      const existingImagePaths = editingTour?.images || [];
      if (existingImagePaths.length > 0) {
        await deleteOldImages(existingImagePaths);
      }

      return newImagePaths;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error: any) {
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

  const handleEdit = (tour: any) => {
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

  const handleCopy = (tour: any) => {
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
        { status: newStatus },
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

  const handleDelete = async (tourId: string) => {
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
              {tours.map((t: any) => (
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