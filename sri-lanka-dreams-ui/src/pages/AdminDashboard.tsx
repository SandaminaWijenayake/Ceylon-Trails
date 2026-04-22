import AdminLayout from "@/components/admin/AdminLayout";
import OverviewPage from "@/pages/admin/OverviewPage";
import ToursManagement from "@/pages/admin/ToursManagement";
import BookingsManagement from "@/pages/admin/BookingsManagement";
import UsersManagement from "@/pages/admin/UsersManagement";

export function AdminOverview() {
  return (
    <AdminLayout>
      <OverviewPage />
    </AdminLayout>
  );
}
export function AdminTours() {
  return (
    <AdminLayout>
      <ToursManagement />
    </AdminLayout>
  );
}
export function AdminBookings() {
  return (
    <AdminLayout>
      <BookingsManagement />
    </AdminLayout>
  );
}
export function AdminUsers() {
  return (
    <AdminLayout>
      <UsersManagement />
    </AdminLayout>
  );
}