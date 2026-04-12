import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Clock, Users, ChevronLeft, ChevronRight, Calendar, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { tours } from "@/data/travel-data";

const tabs = ["Overview", "Itinerary", "Reviews"] as const;

export default function TourDetail() {
  const { id } = useParams();
  const tour = tours.find((t) => t.id === id) || tours[0];
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Overview");
  const [currentImg, setCurrentImg] = useState(0);
  const [guests, setGuests] = useState(2);

  const images = [tour.image, ...tours.filter((t) => t.id !== tour.id).slice(0, 3).map((t) => t.image)];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-travel py-12">
        <Link to="/tours" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to tours
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="relative rounded-lg overflow-hidden aspect-[16/9]">
              <img src={images[currentImg]} alt={tour.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setCurrentImg((p) => (p === 0 ? images.length - 1 : p - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImg((p) => (p === images.length - 1 ? 0 : p + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:bg-card transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-card w-6" : "bg-card/40"}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${i === currentImg ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 uppercase tracking-widest">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tour.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {tour.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {tour.groupType}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight text-balance">{tour.title}</h1>
              <div className="flex items-center gap-2.5 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-semibold">{tour.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({tour.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-border/60">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="py-10">
                {activeTab === "Overview" && (
                  <div className="space-y-8">
                    <p className="text-muted-foreground leading-relaxed text-pretty">{tour.description}</p>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-lg mb-4">What's Included</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {tour.includes.map((inc) => (
                          <div key={inc} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-accent" /> {inc}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-lg mb-4">Tour Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {[
                          { label: "Type", value: tour.type },
                          { label: "Group", value: tour.groupType },
                          { label: "Duration", value: tour.duration },
                          { label: "Rating", value: `${tour.rating} / 5` },
                        ].map((d) => (
                          <div key={d.label} className="bg-muted/60 rounded-md p-4">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">{d.label}</p>
                            <p className="font-medium text-foreground">{d.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "Itinerary" && (
                  <div className="space-y-8">
                    {["Morning: Pickup & Transfer", "Mid-Morning: Main Activity", "Afternoon: Exploration", "Evening: Return Transfer"].map((step, i) => (
                      <div key={i} className="flex gap-5">
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-semibold">{i + 1}</div>
                          {i < 3 && <div className="w-px flex-1 bg-border mt-2" />}
                        </div>
                        <div className="pb-8">
                          <h4 className="font-display font-semibold text-foreground">{step}</h4>
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Detailed description of this part of the tour experience.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "Reviews" && (
                  <div className="space-y-8">
                    {[
                      { name: "Amara H.", text: "Absolutely incredible experience. Our guide was knowledgeable and the views were stunning.", rating: 5, initials: "AH" },
                      { name: "Tobias L.", text: "Well organized from start to finish. Would definitely recommend to anyone visiting Sri Lanka.", rating: 5, initials: "TL" },
                      { name: "Chen W.", text: "Great value for money. The included meals were delicious and authentic.", rating: 4, initials: "CW" },
                    ].map((r) => (
                      <div key={r.name} className="border-b border-border/40 pb-8 last:border-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">{r.initials}</div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{r.name}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: r.rating }).map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border/60 rounded-lg p-7 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)] space-y-7">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">From</span>
                <div className="text-3xl font-bold text-foreground tabular-nums mt-1">${tour.price}<span className="text-sm font-normal text-muted-foreground"> / person</span></div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">Date</label>
                  <div className="flex items-center gap-2 bg-muted/60 rounded-md px-4 py-3">
                    <Calendar className="w-4 h-4 text-accent" />
                    <input type="date" className="bg-transparent text-sm w-full outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">Guests</label>
                  <div className="flex items-center justify-between bg-muted/60 rounded-md px-4 py-3">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-1 hover:bg-background rounded-md transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium tabular-nums">{guests} {guests === 1 ? "Guest" : "Guests"}</span>
                    <button onClick={() => setGuests(guests + 1)} className="p-1 hover:bg-background rounded-md transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40 pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">${tour.price} × {guests} guests</span>
                  <span className="font-medium tabular-nums">${tour.price * guests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="font-medium tabular-nums">${Math.round(tour.price * guests * 0.05)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-3 border-t border-border/40">
                  <span>Total</span>
                  <span className="tabular-nums">${Math.round(tour.price * guests * 1.05)}</span>
                </div>
              </div>

              <Button variant="accent" className="w-full" size="lg" asChild>
                <Link to="/booking-confirmation">Book Now</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">Free cancellation up to 48h before</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
