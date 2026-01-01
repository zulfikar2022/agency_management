import LayoutForProduct from '../layouts/LayoutForProduct';
import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardList, Search, UserCheck } from 'lucide-react';

function ProductEmployeeWiseReport({ employees }) {
  return (
    <LayoutForProduct>
      <Head title="পণ্যের এমপ্লয়ী ভিত্তিক কালেকশন রিপোর্ট" />
      <div className="container mx-auto px-4 py-8">
        <h2 className="font-bold text-3xl text-center mb-10 text-neutral">
          এমপ্লয়ী ভিত্তিক কালেকশন রিপোর্ট (পণ্যের কালেকশন)
        </h2>

        {employees && employees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <EmployeeReportBox key={employee.id} employee={employee} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-base-100 rounded-xl shadow-inner border border-dashed border-base-300">
            <p className="text-xl text-base-content/50">
              কোনো এমপ্লয়ীর তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>
    </LayoutForProduct>
  );
}

/**
 * Reusable Sub-Component for each Employee Card
 */
function EmployeeReportBox({ employee }) {
  // Get today's date for default values
  const today = new Date().toISOString().split('T')[0];

  // Initialize independent form state
  const { data, setData, processing } = useForm({
    employee_id: employee.id,
    start_date: today,
    end_date: today,
  });

  const handleViewReport = (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      start_date: data.start_date,
      end_date: data.end_date,
      employee_id: data.employee_id,
    }).toString();

    const url = `${route('admin.product.employee_wise_collection_report')}?${params}`;

    window.open(url, '_blank');
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
      <div className="card-body p-6">
        <div className="flex items-center gap-4 mb-5 pb-3 border-b">
          <div>
            <h3 className="font-bold text-lg text-neutral">{employee.name}</h3>
            <span className="badge badge-sm badge-outline opacity-70">
              ID: {employee.id}
            </span>
          </div>
        </div>

        <form onSubmit={handleViewReport} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/70">
                শুরুর তারিখ
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered input-md w-full focus:input-primary"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/70">
                শেষের তারিখ
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered input-md w-full focus:input-primary"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
              required
            />
          </div>

          <div className="card-actions pt-2">
            <button
              type="submit"
              disabled={processing}
              className="btn btn-neutral w-full group"
            >
              {processing ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <ClipboardList
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  রিপোর্ট তৈরি করুন (PDF)
                </>
              )}
            </button>
            <Link
              href={route('admin.product.employeeWiseCollectionPage', {
                employee_id: employee.id,
                start_date: data.start_date,
                end_date: data.end_date,
              })}
              target="_blank"
              className="btn btn-outline btn-neutral w-full"
            >
              রিপোর্ট দেখুন
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductEmployeeWiseReport;
