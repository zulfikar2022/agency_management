import AdminDashboardLayout from './AdminDashboardLayout';
import BankLoanDepositAdminDashboard from './Bank/BankLoanDepositAdminDashboard';
import CustomerProductAdminDashboard from './Customers/CustomerProductAdminDashboard';

function Dashboard({
  user,
  totalCustomers,
  sevenDayCollections,
  purchasesSummary,
  stockProductsTotalPrice,
  soldProductsTotalPrice,
  totalCollectedAmount,
  // BANK section data
  totalMembers,
  depositAccountCount,
  loanAccountCount,
  totalDepositAmount,
  totalLoanedAmount,
  // totalCollectableWithInterest,
  totalCollectionForLoan,
  dateWiseLoanAndDepositCollections,
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
        <BankLoanDepositAdminDashboard
          totalMembers={totalMembers}
          depositAccountCount={depositAccountCount}
          loanAccountCount={loanAccountCount}
          totalDepositAmount={totalDepositAmount}
          totalLoanedAmount={totalLoanedAmount}
          // totalCollectableWithInterest={totalCollectableWithInterest}
          totalCollectionForLoan={totalCollectionForLoan}
          dateWiseLoanAndDepositCollections={dateWiseLoanAndDepositCollections}
        />
      </div>
    </AdminDashboardLayout>
  );
}

export default Dashboard;
