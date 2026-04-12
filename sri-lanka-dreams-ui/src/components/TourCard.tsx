import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Tour } from "@/data/travel-data";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      to={`/tours/${tour.id}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] transition-all duration-500"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-[11px] font-medium px-3 py-1 rounded-full text-foreground tracking-wide">
          {tour.duration}
        </span>
      </div>
      <div className="p-5 space-y-3">
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
            <span className="text-xs text-muted-foreground">({tour.reviewCount})</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">from</span>
            <span className="ml-1.5 text-lg font-semibold text-foreground tabular-nums">${tour.price}</span>
          </div>
        </div>
        <Button variant="accent" className="w-full mt-2" size="sm">
          Book Now
        </Button>
      </div>
    </Link>
  );
}
