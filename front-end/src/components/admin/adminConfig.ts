import { LayoutDashboard, Map, CalendarCheck, Users } from "lucide-react";

export const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Tours", icon: Map, path: "/admin/tours" },
  { label: "Bookings", icon: CalendarCheck, path: "/admin/bookings" },
  { label: "Users", icon: Users, path: "/admin/users" },
];

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE}/assets/tours/${imagePath}`;
};