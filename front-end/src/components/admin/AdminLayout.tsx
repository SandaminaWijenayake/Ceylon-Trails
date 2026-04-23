import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { navItems } from "./adminConfig";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userName = localStorage.getItem("userName") || "Admin";
  const userInitials = userName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`${mobile ? "w-64 h-full" : sidebarOpen ? "w-64" : "w-16"} bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 shrink-0`}
    >
      <div className="h-[72px] flex items-center px-5 gap-3 border-b border-sidebar-border">
        {(sidebarOpen || mobile) && (
          <Link to="/" className="flex items-center gap-3">
            <span className="font-display font-bold text-lg tracking-tight">
              Ceylon<span className="text-sidebar-primary">Trails</span>
            </span>
          </Link>
        )}
      </div>
      <nav className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileSidebar(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {(sidebarOpen || mobile) && (
                <span className="tracking-wide">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {mobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-foreground/20"
            onClick={() => setMobileSidebar(false)}
          />
          <div className="relative z-10 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] border-b border-border/60 bg-card flex items-center justify-between px-5 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileSidebar(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              className="hidden lg:block"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                {userInitials}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {userName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Logout"
            >
              <LogOut className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}