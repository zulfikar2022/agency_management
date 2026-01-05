import { Head } from '@inertiajs/react';
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
  activeTotalLoanedAmount,
  totalAdmissionFee,
  totalLoanFee,
  totalShareMoney,
  // other props,
  dataEntryMode = false,
}) {
  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <Head title="এডমিন ড্যাশবোর্ড" />
      <div className="dashboard h-full container mx-auto p-4 ">
        <div className="flex flex-col justify-center items-center mb-4  font-bold text-2xl gap-4 bg-warning/10 p-4 rounded-md border border-warning">
          <p>
            এডমিনের নামঃ <span className="font-normal">{user?.name}</span>
          </p>
          <p>
            এডমিনের ইমেইলঃ <span className="font-normal">{user?.email}</span>
          </p>
        </div>
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
          activeTotalLoanedAmount={activeTotalLoanedAmount}
          totalAdmissionFee={totalAdmissionFee}
          totalLoanFee={totalLoanFee}
          totalShareMoney={totalShareMoney}
        />
      </div>
    </AdminDashboardLayout>
  );
}

export default Dashboard;
