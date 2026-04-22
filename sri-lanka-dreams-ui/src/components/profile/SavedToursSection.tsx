import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE}/assets/tours/${imagePath}`;
};

interface SavedTour {
  _id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  tourPrice: number;
  createdAt: string;
}

interface SavedToursSectionProps {
  tours: SavedTour[];
  onRemove: (tourId: string) => void;
  isRemoving: string | null;
}

export default function SavedToursSection({ tours, onRemove, isRemoving }: SavedToursSectionProps) {
  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No saved tours yet.</p>
        <Link to="/tours">
          <Button className="mt-4">Explore Tours</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {tours.map((tour) => (
        <div
          key={tour._id}
          className="group relative bg-card border border-border/60 rounded-lg overflow-hidden hover:shadow-md transition-all duration-500"
        >
          <Link to={`/tours/${tour.tourId}`} className="block">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={getImageUrl(tour.tourImage)}
                alt={tour.tourTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(tour.tourId);
                }}
                disabled={isRemoving === tour.tourId}
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
                <span className="text-xs text-muted-foreground">from</span>
                <span className="font-semibold text-foreground text-sm">
                  ${tour.tourPrice}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}