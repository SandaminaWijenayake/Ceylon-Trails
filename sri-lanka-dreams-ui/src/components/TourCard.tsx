import { useState, useEffect } from "react";
import { Star, MapPin, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Tour } from "@/data/travel-data";
import axios from "axios";
import { isTokenValid } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// Helper to get tour ID from either _id or id field
const getTourId = (tour: Tour): string => (tour._id || tour.id) as string;

// Helper to get full image URL
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE}/assets/tours/${imagePath}`;
};

export default function TourCard({ tour }: { tour: Tour }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem("authToken");
  const isLoggedIn = isTokenValid(token);

  useEffect(() => {
    if (isLoggedIn) {
      checkIfSaved();
    }
  }, [getTourId(tour), isLoggedIn]);

  const checkIfSaved = async () => {
    if (!isLoggedIn) return;

    try {
      const response = await axios.get(
        `${API_BASE}/wishlist/check/${getTourId(tour)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save tours.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await axios.delete(`${API_BASE}/wishlist/${getTourId(tour)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSaved(false);
        toast({
          title: "Removed",
          description: "Tour removed from saved tours.",
        });
      } else {
        await axios.post(
          `${API_BASE}/wishlist`,
          {
            tourId: getTourId(tour),
            tourTitle: tour.title,
            tourImage: tour.images?.[0],
            tourPrice: tour.price,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setIsSaved(true);
        toast({
          title: "Saved",
          description: "Tour added to saved tours.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update wishlist.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      to={`/tours/${getTourId(tour)}`}
      className="group flex flex-col bg-card rounded-lg overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] transition-all duration-500 h-full"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={getImageUrl(tour.images?.[0] || "")}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-[11px] font-medium px-3 py-1 rounded-full text-foreground tracking-wide">
          {tour.duration}
        </span>
        {isLoggedIn && (
          <button
            onClick={handleHeartClick}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors disabled:opacity-50"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isSaved
                  ? "fill-accent text-accent"
                  : "text-muted-foreground hover:text-accent"
              }`}
            />
          </button>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] uppercase tracking-widest">
            <MapPin className="w-3 h-3" />
            {tour.location}
          </div>
          <h3 className="font-display font-semibold text-foreground text-lg leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-300">
            {tour.title}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-sm font-semibold">{tour.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({tour.reviewCount})
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                from
              </span>
              <span className="ml-1.5 text-lg font-semibold text-foreground tabular-nums">
                ${tour.price}
              </span>
            </div>
          </div>
        </div>
        <Button variant="accent" className="w-full mt-auto" size="sm">
          Book Now
        </Button>
      </div>
    </Link>
  );
}
