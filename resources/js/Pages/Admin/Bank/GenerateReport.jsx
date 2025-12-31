import LayoutForMoney from '../layouts/LayoutForMoney';
import { useForm } from '@inertiajs/react';

function GenerateReport() {
  const today = new Date().toISOString().split('T')[0];

  // 1. Individual Form States
  const depositCollectionForm = useForm({ start_date: today, end_date: today });
  const briefDepositCollectionForm = useForm({
    start_date: today,
    end_date: today,
  });
  const loanCollectionForm = useForm({ start_date: today, end_date: today });
  const briefLoanCollectionForm = useForm({
    start_date: today,
    end_date: today,
  });
  const withdrawForm = useForm({ start_date: today, end_date: today });
  const briefWithdrawForm = useForm({ start_date: today, end_date: today });
  const loansForm = useForm({ start_date: today, end_date: today });
  const briefLoansForm = useForm({ start_date: today, end_date: today });
  const depositsForm = useForm({ start_date: today, end_date: today });

  /**
   * Helper function to generate the PDF URL and open it
   */
  const openPdfReport = (routeName, formData) => {
    // Construct query parameters
    const params = new URLSearchParams({
      start_date: formData.start_date,
      end_date: formData.end_date,
    }).toString();

    // Generate the route URL and append params
    const url = `${route(routeName)}?${params}`;

    // Open in a new tab (Required for PDFs)
    window.open(url, '_blank');
  };

  // 2. Separate Submission Handlers
  const handleDepositCollectionReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.bank.generate_deposit_collection_report',
      depositCollectionForm.data
    );
  };

  // admin.bank.generate_brief_deposit_collection_report

  const handleBriefDepositCollectionReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.bank.generate_brief_deposit_collection_report',
      briefDepositCollectionForm.data
    );
  };

  const handleLoanCollectionReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.bank.generate_loan_collection_report',
      loanCollectionForm.data
    );
  };

  const handleBriefLoanCollectionReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.bank.generate_brief_loan_collection_report',
      briefLoanCollectionForm.data
    );
  };

  const handleWithdrawReport = (e) => {
    e.preventDefault();
    openPdfReport('admin.bank.generate_withdraw_report', withdrawForm.data);
  };

  const handleBriefWithdrawReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.bank.generate_brief_withdraw_report',
      briefWithdrawForm.data
    );
  };

  const handleLoansReport = (e) => {
    e.preventDefault();
    openPdfReport('admin.bank.generate_loans_report', loansForm.data);
  };

  const handleBriefLoansReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.bank.generate_brief_loans_report',
      briefLoansForm.data
    );
  };

  const handleDepositsReport = (e) => {
    e.preventDefault();
    openPdfReport('admin.bank.generate_deposits_report', depositsForm.data);
  };

  return (
    <LayoutForMoney>
      <div className="container mx-auto px-4 py-8">
        <h2 className="font-bold text-3xl text-center mb-10 text-neutral">
          রিপোর্ট তৈরি করুন
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportBox
            title="সঞ্চয় সংগ্রহের বিস্তারিত রিপোর্ট"
            form={depositCollectionForm}
            onSubmit={handleDepositCollectionReport}
          />
          <ReportBox
            title="সঞ্চয় সংগ্রহের সংক্ষিপ্ত রিপোর্ট"
            form={briefDepositCollectionForm}
            onSubmit={handleBriefDepositCollectionReport}
          />

          <ReportBox
            title="ঋণের কিস্তি সংগ্রহের বিস্তারিত রিপোর্ট"
            form={loanCollectionForm}
            onSubmit={handleLoanCollectionReport}
          />
          <ReportBox
            title="ঋণের কিস্তি সংগ্রহের সংক্ষিপ্ত রিপোর্ট"
            form={briefLoanCollectionForm}
            onSubmit={handleBriefLoanCollectionReport}
          />

          <ReportBox
            title="টাকা উত্তোলনের বিস্তারিত রিপোর্ট"
            form={withdrawForm}
            onSubmit={handleWithdrawReport}
          />

          <ReportBox
            title="টাকা উত্তোলনের সংক্ষিপ্ত রিপোর্ট"
            form={briefWithdrawForm}
            onSubmit={handleBriefWithdrawReport}
          />

          <ReportBox
            title="ঋণ প্রদানের বিস্তারিত রিপোর্ট"
            form={loansForm}
            onSubmit={handleLoansReport}
          />
          <ReportBox
            title="ঋণ প্রদানের সংক্ষিপ্ত রিপোর্ট"
            form={briefLoansForm}
            onSubmit={handleBriefLoansReport}
          />

          <ReportBox
            title="সঞ্চয় একাউন্টের রিপোর্ট"
            form={depositsForm}
            onSubmit={handleDepositsReport}
          />
        </div>
      </div>
    </LayoutForMoney>
  );
}

/**
 * Reusable Sub-Component for each Report Box
 */
function ReportBox({ title, form, onSubmit }) {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">
                শুরুর তারিখ
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              value={form.data.start_date}
              onChange={(e) => form.setData('start_date', e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">
                শেষের তারিখ
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              value={form.data.end_date}
              onChange={(e) => form.setData('end_date', e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-neutral btn-sm w-full mt-2">
            রিপোর্ট তৈরি করুন
          </button>
        </form>
      </div>
    </div>
  );
}

export default GenerateReport;
