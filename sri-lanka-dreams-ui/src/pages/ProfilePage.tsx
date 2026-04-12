import { Star, MapPin, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { tours, bookings } from "@/data/travel-data";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container-travel py-16">
        {/* User info */}
        <div className="bg-card border border-border/60 rounded-lg p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-14">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">AH</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Amara Hendricks</h1>
            <p className="text-sm text-muted-foreground mt-1">amara@example.com</p>
            <p className="text-xs text-muted-foreground mt-1.5">Member since January 2026 · 3 bookings</p>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>

        {/* Booking History */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Booking History</h2>
          <div className="space-y-4">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="bg-card border border-border/60 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-muted/60 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{b.tour}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.date} · ${b.amount}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${b.status === "confirmed" ? "bg-accent/10 text-accent" : b.status === "pending" ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Wishlist */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-8">Saved Tours</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {tours.slice(0, 3).map((t) => (
              <Link key={t.id} to={`/tours/${t.id}`} className="group bg-card border border-border/60 rounded-lg overflow-hidden hover:shadow-md transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <Heart className="absolute top-3 right-3 w-5 h-5 fill-accent text-accent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1.5 uppercase tracking-widest">
                    <MapPin className="w-3 h-3" /> {t.location}
                  </div>
                  <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1">{t.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-accent text-accent" /> {t.rating}</span>
                    <span className="font-semibold text-foreground text-sm">${t.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
