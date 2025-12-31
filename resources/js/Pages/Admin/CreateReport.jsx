import { Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from './AdminDashboardLayout';
import { ArrowLeft } from 'lucide-react';

export default function CreateReport() {
  const today = new Date().toISOString().split('T')[0];

  const detailedCostCollectionForm = useForm({
    start_date: today,
    end_date: today,
  });

  const briefCostCollectionForm = useForm({
    start_date: today,
    end_date: today,
  });

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

  const handleDetailedCostCollectionReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.generateCostDetailsReport',
      detailedCostCollectionForm.data
    );
  };

  const handleBrifeCostCollectionReport = (e) => {
    e.preventDefault();
    openPdfReport(
      'admin.generateBriefCostReport',
      briefCostCollectionForm.data
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto px-2 py-2">
        <div className="pl-10 mt-4">
          <Link href={route('home')} className="text-blue-700 underline ">
            {' '}
            <span className="flex">
              <ArrowLeft /> <span>ফিরে যান</span>
            </span>{' '}
          </Link>
        </div>{' '}
        <h1 className="font-bold text-2xl text-center my-3">
          রিপোর্ট তৈরি করুন
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportBox
            title="খরচের বিস্তারিত রিপোর্ট"
            form={detailedCostCollectionForm}
            onSubmit={handleDetailedCostCollectionReport}
          />
          <ReportBox
            title="খরচের সংক্ষিপ্ত রিপোর্ট"
            form={briefCostCollectionForm}
            onSubmit={handleBrifeCostCollectionReport}
          />
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

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
