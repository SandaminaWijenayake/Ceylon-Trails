import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-travel py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">
          <div>
            <Link to="/" className="font-display text-xl font-bold mb-5 block tracking-tight">
              Ceylon<span className="text-accent">Trails</span>
            </Link>
            <p className="text-sm opacity-70 leading-relaxed text-pretty">
              Curated travel experiences across Sri Lanka for the discerning explorer. Ancient ruins, pristine beaches, and vibrant culture.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-accent">Explore</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/tours" className="hover:opacity-100 hover:text-accent transition-all">All Tours</Link></li>
              <li><Link to="#" className="hover:opacity-100 hover:text-accent transition-all">Destinations</Link></li>
              <li><Link to="#" className="hover:opacity-100 hover:text-accent transition-all">Travel Guide</Link></li>
              <li><Link to="#" className="hover:opacity-100 hover:text-accent transition-all">Journal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-accent">Company</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="#" className="hover:opacity-100 hover:text-accent transition-all">About Us</Link></li>
              <li><Link to="#" className="hover:opacity-100 hover:text-accent transition-all">Careers</Link></li>
              <li><Link to="#" className="hover:opacity-100 hover:text-accent transition-all">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:opacity-100 hover:text-accent transition-all">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-accent">Contact</h4>
            <ul className="space-y-4 text-sm opacity-70">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-accent" /> hello@ceylontrails.lk</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-accent" /> +94 11 234 5678</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-accent" /> Colombo 03, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 text-center text-xs opacity-40 tracking-wider">
          © 2026 CeylonTrails. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
