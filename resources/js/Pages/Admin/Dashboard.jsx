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
  totalCollectionForLoan,
  dateWiseLoanAndDepositCollections,
  totalInterestPaidForLoan,
  totalMainPaidForLoan,
  totalRemainingPayableMain,
  totalRemainingPayableInterest,
  totalCost,
}) {
  console.log(totalInterestPaidForLoan, totalMainPaidForLoan);
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
          totalCost={totalCost}
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
          totalInterestPaidForLoan={totalInterestPaidForLoan}
          totalMainPaidForLoan={totalMainPaidForLoan}
          totalRemainingPayableMain={totalRemainingPayableMain}
          totalRemainingPayableInterest={totalRemainingPayableInterest}
        />
      </div>
    </AdminDashboardLayout>
  );
}

export default Dashboard;
