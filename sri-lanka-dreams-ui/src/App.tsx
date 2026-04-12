import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import TourListing from "./pages/TourListing";
import TourDetail from "./pages/TourDetail";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import ProfilePage from "./pages/ProfilePage";
import BookingConfirmation from "./pages/BookingConfirmation";
import { AdminOverview, AdminTours, AdminBookings, AdminUsers } from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tours" element={<TourListing />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/tours" element={<AdminTours />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
