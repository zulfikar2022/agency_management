import AdminDashboardLayout from './AdminDashboardLayout';
import CustomerProductAdminDashboard from './Customers/CustomerProductAdminDashboard';

function Dashboard({
  user,
  totalCustomers,
  sevenDayCollections,
  purchasesSummary,
  stockProductsTotalPrice,
  soldProductsTotalPrice,
  totalCollectedAmount,
}) {
  return (
    <AdminDashboardLayout>
      <div className="dashboard h-full container mx-auto p-4">
        <CustomerProductAdminDashboard
          totalCustomers={totalCustomers}
          sevenDayCollections={sevenDayCollections}
          purchasesSummary={purchasesSummary}
          stockProductsTotalPrice={stockProductsTotalPrice}
          soldProductsTotalPrice={soldProductsTotalPrice}
          totalCollectedAmount={totalCollectedAmount}
        />
      </div>
    </AdminDashboardLayout>
  );
}

export default Dashboard;
