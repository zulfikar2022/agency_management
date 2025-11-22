import AdminDashboardLayout from './AdminDashboardLayout';
import CustomerProductAdminDashboard from './Customers/CustomerProductAdminDashboard';

function Dashboard({
  user,
  totalCustomers,
  sevenDayCollections,
  purchasesSummary,
}) {
  return (
    <AdminDashboardLayout>
      <div className="dashboard h-full container mx-auto p-4">
        <CustomerProductAdminDashboard
          totalCustomers={totalCustomers}
          sevenDayCollections={sevenDayCollections}
          purchasesSummary={purchasesSummary}
        />
      </div>
    </AdminDashboardLayout>
  );
}

export default Dashboard;
