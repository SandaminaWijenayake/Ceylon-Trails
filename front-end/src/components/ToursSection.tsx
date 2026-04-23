import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import TourCard from "@/components/TourCard";
import { RevealSection } from "./RevealSection";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function ToursSection() {
  const [apiTours, setApiTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${API_BASE}/tours`);
        const activeTours = response.data.tours.filter(
          (t: any) => t.status === "active",
        );
        const topRated = activeTours
          .sort((a: any, b: any) => b.rating - a.rating)
          .slice(0, 4);
        setApiTours(topRated);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <section className="py-28 bg-muted/40">
      <div className="container-travel">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            Curated Experiences
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
            Popular Tours
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
            Traveller-tested, locally guided — our most loved experiences.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Loading tours...
            </div>
          ) : apiTours.length > 0 ? (
            apiTours.map((t, i) => (
              <RevealSection key={t._id} delay={i * 80}>
                <TourCard tour={t} />
              </RevealSection>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No tours available
            </div>
          )}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link to="/tours">View all tours →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}