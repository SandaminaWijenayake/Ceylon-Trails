import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Tours", to: "/tours" },
  { label: "About", to: "#" },
  { label: "Contact", to: "#" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/40">
      <div className="container-travel flex items-center justify-between h-[72px]">
        <Link to="/" className="font-display text-xl font-bold text-foreground tracking-tight">
          Ceylon<span className="text-accent">Trails</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`text-[13px] font-medium uppercase tracking-widest transition-colors hover:text-accent ${pathname === l.to ? "text-foreground" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background p-6 space-y-4 animate-fade-up">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} className="block py-2 text-sm font-medium text-foreground tracking-wide" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button variant="accent" size="sm" className="flex-1" asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
