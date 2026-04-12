import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Map, CalendarCheck, Users, Bell, Search, ChevronDown,
  Menu, X, TrendingUp, DollarSign, UserCheck, BarChart3, MoreHorizontal,
  Plus, Edit, Trash2, Copy, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { tours, bookings, adminUsers } from "@/data/travel-data";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Tours", icon: Map, path: "/admin/tours" },
  { label: "Bookings", icon: CalendarCheck, path: "/admin/bookings" },
  { label: "Users", icon: Users, path: "/admin/users" },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const { pathname } = useLocation();

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? "w-64" : sidebarOpen ? "w-64" : "w-16"} bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 shrink-0`}>
      <div className="h-[72px] flex items-center px-5 gap-3 border-b border-sidebar-border">
        {(sidebarOpen || mobile) && (
          <span className="font-display font-bold text-lg tracking-tight">
            Ceylon<span className="text-sidebar-primary">Trails</span>
          </span>
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
              {(sidebarOpen || mobile) && <span className="tracking-wide">{item.label}</span>}
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
          <div className="fixed inset-0 bg-foreground/20" onClick={() => setMobileSidebar(false)} />
          <div className="relative z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] border-b border-border/60 bg-card flex items-center justify-between px-5 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileSidebar(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <button className="hidden lg:block" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-muted/60 border border-border/40 rounded-md px-4 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search..." className="bg-transparent text-sm outline-none w-full" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">PS</div>
              <span className="text-sm font-medium hidden sm:block">Priya S.</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function OverviewPage() {
  const stats = [
    { label: "Total Bookings", value: "1,247", change: "+12.5%", icon: CalendarCheck, color: "text-accent" },
    { label: "Revenue", value: "$184,392", change: "+8.2%", icon: DollarSign, color: "text-accent" },
    { label: "Active Users", value: "3,891", change: "+15.3%", icon: UserCheck, color: "text-accent" },
    { label: "Conversion Rate", value: "4.7%", change: "+0.8%", icon: BarChart3, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border/60 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon className={`w-[18px] h-[18px] ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
            <span className="text-xs text-accent font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> {s.change} vs last month
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/60 rounded-lg p-7">
          <h3 className="font-display font-semibold text-foreground text-lg mb-5">Revenue Over Time</h3>
          <div className="h-48 flex items-end justify-center gap-3">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div key={i} className="w-5 rounded-t bg-accent/20 hover:bg-accent/40 transition-colors" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="bg-card border border-border/60 rounded-lg p-7">
          <h3 className="font-display font-semibold text-foreground text-lg mb-5">Booking Trends</h3>
          <div className="h-48 flex items-end justify-center gap-3">
            {[30, 50, 70, 45, 85, 60, 40, 75, 90, 55, 80, 65].map((h, i) => (
              <div key={i} className="w-5 rounded-t bg-primary/15 hover:bg-primary/30 transition-colors" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-lg p-7">
        <h3 className="font-display font-semibold text-foreground text-lg mb-5">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60">
                <th className="pb-4 font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider">Guest</th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Tour</th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="pb-4 font-medium text-xs uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 font-medium text-foreground">{b.id}</td>
                  <td className="py-4 text-muted-foreground">{b.user}</td>
                  <td className="py-4 hidden sm:table-cell max-w-[200px] truncate text-muted-foreground">{b.tour}</td>
                  <td className="py-4"><StatusBadge status={b.status} /></td>
                  <td className="py-4 text-right font-medium tabular-nums">${b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ToursManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tour Management</h1>
        <Button variant="accent" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Tour
        </Button>
      </div>

      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60 bg-muted/30">
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Tour</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Location</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Price</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((t) => (
                <tr key={t.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt={t.title} className="w-10 h-10 rounded-md object-cover shrink-0" />
                      <span className="font-medium text-foreground line-clamp-1">{t.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{t.location}</td>
                  <td className="px-5 py-4 font-medium tabular-nums">${t.price}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                      <Eye className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><Copy className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card border border-border/60 rounded-lg p-7 w-full max-w-lg shadow-xl space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground font-display">Add New Tour</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <ModalField label="Title" placeholder="Tour name" />
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Location" placeholder="City" />
              <ModalField label="Price ($)" placeholder="0" type="number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ModalField label="Duration" placeholder="e.g., 2-3 days" />
              <ModalField label="Type" placeholder="Adventure" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">Description</label>
              <textarea rows={3} className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 resize-none" placeholder="Tour description..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="accent" className="flex-1" onClick={() => setShowModal(false)}>Save Tour</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsManagement() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60 bg-muted/30">
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Guest</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Tour</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{b.id}</td>
                  <td className="px-5 py-4 text-muted-foreground">{b.user}</td>
                  <td className="px-5 py-4 hidden md:table-cell max-w-[200px] truncate text-muted-foreground">{b.tour}</td>
                  <td className="px-5 py-4 text-muted-foreground">{b.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersManagement() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">User Management</h1>
      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60 bg-muted/30">
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">User</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider">Role</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Bookings</th>
                <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((u) => (
                <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">{u.initials}</div>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 tabular-nums hidden md:table-cell text-muted-foreground">{u.bookings}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "confirmed" | "pending" | "cancelled" }) {
  const styles = {
    confirmed: "bg-accent/10 text-accent",
    pending: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>;
}

function ModalField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">{label}</label>
      <input {...props} className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
    </div>
  );
}

export function AdminOverview() {
  return <AdminLayout><OverviewPage /></AdminLayout>;
}
export function AdminTours() {
  return <AdminLayout><ToursManagement /></AdminLayout>;
}
export function AdminBookings() {
  return <AdminLayout><BookingsManagement /></AdminLayout>;
}
export function AdminUsers() {
  return <AdminLayout><UsersManagement /></AdminLayout>;
}
