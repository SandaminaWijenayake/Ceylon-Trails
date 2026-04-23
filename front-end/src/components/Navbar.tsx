import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isTokenValid } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Tours", to: "/tours" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = isTokenValid(localStorage.getItem("authToken"));
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";
  const userName = localStorage.getItem("userName") || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/40">
      <div className="container-travel flex items-center justify-between h-[72px]">
        <Link
          to="/"
          className="font-display text-xl font-bold text-foreground tracking-tight"
        >
          Ceylon<span className="text-accent">Trails</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`text-[13px] font-medium uppercase tracking-widest transition-colors hover:text-accent ${
                pathname === l.to ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border/60 hover:border-accent/40 hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                  {userInitials}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {userName}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border/60 rounded-lg shadow-lg p-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center text-left gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button variant="accent" size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background p-6 space-y-4 animate-fade-up">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="block py-2 text-sm font-medium text-foreground tracking-wide"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="pt-4 space-y-4 border-t">
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="block w-full py-2 text-sm font-medium text-foreground tracking-wide text-left"
              >
                Profile
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setOpen(false);
                  }}
                  className="block w-full py-2 text-sm font-medium text-foreground tracking-wide text-left"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="block w-full py-2 text-sm font-medium text-destructive tracking-wide text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-4">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button variant="accent" size="sm" className="flex-1" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
