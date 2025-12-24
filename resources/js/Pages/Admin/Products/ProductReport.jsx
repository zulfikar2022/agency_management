import { useForm } from '@inertiajs/react';
import LayoutForProduct from '../layouts/LayoutForProduct';

function ProductReport() {
  const today = new Date().toISOString().split('T')[0];

  // 1. Individual Form States for Sales and Collection
  const salesReportForm = useForm({ start_date: today, end_date: today });
  const collectionReportForm = useForm({ start_date: today, end_date: today });

  /**
   * Helper function to generate the PDF URL and open it in a new tab
   */
  const openPdfReport = (routeName, formData) => {
    const params = new URLSearchParams({
      start_date: formData.start_date,
      end_date: formData.end_date,
    }).toString();

    const url = `${route(routeName)}?${params}`;
    window.open(url, '_blank');
  };

  // 2. Separate Submission Handlers
  const handleSalesReport = (e) => {
    e.preventDefault();
    console.log('Sales Report Form Data:', salesReportForm.data);
    openPdfReport('admin.product.generate_sales_report', salesReportForm.data);
  };

  const handleCollectionReport = (e) => {
    e.preventDefault();
    console.log('Collection Report Form Data:', collectionReportForm.data);
    openPdfReport(
      'admin.product.generate_collection_report',
      collectionReportForm.data
    );
  };

  return (
    <LayoutForProduct>
      <div className="container mx-auto px-4 py-8">
        <h2 className="font-bold text-3xl text-center mb-10 text-neutral">
          পণ্য ও বিক্রয় রিপোর্ট
        </h2>

        {/* Using max-w-4xl and mx-auto to make 2 cards look centered and clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Box 1: বিক্রির রিপোর্ট */}
          <ReportBox
            title="বিক্রির রিপোর্ট"
            form={salesReportForm}
            onSubmit={handleSalesReport}
          />

          {/* Box 2: টাকা সংগ্রহের রিপোর্ট */}
          <ReportBox
            title="টাকা সংগ্রহের রিপোর্ট"
            form={collectionReportForm}
            onSubmit={handleCollectionReport}
          />
        </div>
      </div>
    </LayoutForProduct>
  );
}

/**
 * Reusable Sub-Component for each Report Box
 * Consistent with your provided structure
 */
function ReportBox({ title, form, onSubmit }) {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-lg text-neutral">{title}</h3>
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
              className="input input-bordered input-sm w-full focus:input-neutral"
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
              className="input input-bordered input-sm w-full focus:input-neutral"
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

export default ProductReport;
