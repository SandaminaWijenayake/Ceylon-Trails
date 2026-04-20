import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const locations = [
  "All",
  "Colombo",
  "Ella",
  "Kandy",
  "Galle",
  "Mirissa",
  "Sigiriya",
];
const durations = ["All", "1 day", "2-3 days", "4-7 days", "7+ days"];
const tourTypes = [
  "Beach",
  "Adventure",
  "Wildlife Safari",
  "Cultural",
  "Hiking",
  "Luxury",
];
const groupTypes = ["Solo", "Couple", "Family", "Group"];
const includesOptions = ["Transport", "Meals", "Hotel", "Guide"];

export default function TourListing() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedIncludes, setSelectedIncludes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get(`${API_BASE}/tours`);
      setTours(response.data.tours);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeFilters: string[] = [];
  if (selectedLocation !== "All") activeFilters.push(selectedLocation);
  if (selectedDuration !== "All") activeFilters.push(selectedDuration);
  selectedTypes.forEach((t) => activeFilters.push(t));
  selectedGroups.forEach((g) => activeFilters.push(g));
  if (minRating > 0) activeFilters.push(`${minRating}★+`);

  const filtered = tours
    .filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (selectedLocation !== "All" && t.location !== selectedLocation)
        return false;
      if (selectedDuration !== "All" && t.duration !== selectedDuration)
        return false;
      if (selectedTypes.length && !selectedTypes.includes(t.type)) return false;
      if (selectedGroups.length && !selectedGroups.includes(t.groupType))
        return false;
      if (
        selectedIncludes.length &&
        !selectedIncludes.every((inc) => t.includes.includes(inc))
      )
        return false;
      if (minRating > 0 && t.rating < minRating) return false;
      if (t.price < priceRange[0] || t.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) =>
      sort === "price" ? a.price - b.price : b.rating - a.rating,
    );

  const clearAll = () => {
    setSelectedLocation("All");
    setSelectedDuration("All");
    setSelectedTypes([]);
    setSelectedGroups([]);
    setSelectedIncludes([]);
    setMinRating(0);
    setPriceRange([0, 500]);
    setSearch("");
  };

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" /> Filters
        </h3>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-accent hover:underline tracking-wide uppercase"
          >
            Clear all
          </button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-3 py-1 rounded-full font-medium"
            >
              {f} <X className="w-3 h-3 cursor-pointer" />
            </span>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Location
        </h4>
        <div className="space-y-2.5">
          {locations.map((l) => (
            <label
              key={l}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="location"
                checked={selectedLocation === l}
                onChange={() => setSelectedLocation(l)}
                className="accent-accent"
              />
              {l}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Price Range
        </h4>
        <input
          type="range"
          min={0}
          max={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Duration
        </h4>
        <div className="space-y-2.5">
          {durations.map((d) => (
            <label
              key={d}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="duration"
                checked={selectedDuration === d}
                onChange={() => setSelectedDuration(d)}
                className="accent-accent"
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Tour Type
        </h4>
        <div className="space-y-2.5">
          {tourTypes.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(t)}
                onChange={() => setSelectedTypes(toggleArray(selectedTypes, t))}
                className="accent-accent rounded"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Rating
        </h4>
        <div className="space-y-2.5">
          {[4, 3].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="accent-accent"
              />
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {r}+
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              className="accent-accent"
            />
            Any
          </label>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Group Type
        </h4>
        <div className="space-y-2.5">
          {groupTypes.map((g) => (
            <label
              key={g}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedGroups.includes(g)}
                onChange={() =>
                  setSelectedGroups(toggleArray(selectedGroups, g))
                }
                className="accent-accent rounded"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Includes
        </h4>
        <div className="space-y-2.5">
          {includesOptions.map((inc) => (
            <label
              key={inc}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedIncludes.includes(inc)}
                onChange={() =>
                  setSelectedIncludes(toggleArray(selectedIncludes, inc))
                }
                className="accent-accent rounded"
              />
              {inc}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-travel py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Explore Tours
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {filtered.length} experiences found
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-card border border-border/60 rounded-md px-4 py-2.5 flex-1 sm:flex-initial sm:w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search tours..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm w-full outline-none"
              />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-card border border-border/60 rounded-md px-4 py-2.5 pr-8 text-sm outline-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price">Lowest Price</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showMobileFilters && (
          <div className="lg:hidden bg-card border border-border/60 rounded-lg p-6 mb-8 animate-fade-up">
            <FilterSidebar />
          </div>
        )}

        <div className="flex gap-10">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card border border-border/60 rounded-lg p-6">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <MapPin className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                  No tours match your filters
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button variant="outline" onClick={clearAll}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {filtered.map((t) => (
                  <TourCard key={t.id} tour={t} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
