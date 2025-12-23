import LayoutForMoney from '../layouts/LayoutForMoney';
import { useForm } from '@inertiajs/react';
import { Search, User } from 'lucide-react';

function EmployeeWiseCollection({ employees }) {
  return (
    <LayoutForMoney>
      <div className="container mx-auto px-4 py-8">
        <h2 className="font-bold text-3xl text-center mb-10 text-neutral">
          এমপ্লয়ী ভিত্তিক রিপোর্ট
        </h2>

        {employees.length === 0 ? (
          <div className="text-center py-10 opacity-60">
            কোনো এমপ্লয়ী পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <EmployeeReportBox key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </div>
    </LayoutForMoney>
  );
}

/**
 * Reusable Sub-Component for each Employee Box
 */
function EmployeeReportBox({ employee }) {
  const today = new Date().toISOString().split('T')[0];

  // Initialize form with employee ID and dates
  const { data, setData, post, processing } = useForm({
    employee_id: employee.id,
    start_date: today,
    end_date: today,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the URL with query parameters for PDF/Report generation
    const params = new URLSearchParams({
      start_date: data.start_date,
      end_date: data.end_date,
      employee_id: data.employee_id,
    }).toString();

    // Replace with your actual backend route for employee-specific reports
    const url = `${route('admin.bank.generate_employee_wise_collection_report')}?${params}`;

    window.open(url, '_blank');
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary/30 transition-colors">
      <div className="card-body p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{employee.name}</h3>
            <p className="text-xs opacity-60">ID: #{employee.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">
                শুরুর তারিখ
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
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
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="btn btn-neutral btn-sm w-full mt-2 gap-2"
          >
            {processing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <Search size={14} /> রিপোর্ট দেখুন
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeWiseCollection;
