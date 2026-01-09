import AdminDashboardLayout from '../../AdminDashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft, Edit, Calendar } from 'lucide-react';

function DEUpdateLoanCollection({
  member,
  loanCollection,
  dataEntryMode = false,
}) {
  const { data, setData, patch, processing, errors } = useForm({
    loan_collection_id: loanCollection?.id, // Invisible field
    paid_amount: loanCollection?.paid_amount / 100 || '',
    interest_paid_amount: loanCollection?.interest_paid_amount / 100 || '',
    last_collecting_date: loanCollection?.paying_date
      ? new Date(loanCollection.created_at).toISOString().split('T')[0]
      : '',
  });
  console.log(loanCollection);

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'কিস্তি আপডেট নিশ্চিত করুন',
      text: `আপনি কি কিস্তির পরিমাণ পরিবর্তন করে ${data.paid_amount} টাকা করতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(data);
        // লারাভেল কনভেনশন অনুযায়ী আপডেট রিকোয়েস্টের জন্য patch ব্যবহার করা হয়েছে
        patch(route('admin.bank.de.save_updated_loan_collection'), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('কিস্তি সফলভাবে আপডেট করা হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
            });
          },
          onError: (err) => {
            toast.error('আপডেট ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।');
          },
        });
      }
    });
  };

  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <Head title="কিস্তি আদায় আপডেট" />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="mb-4">
            <Link
              href={route('admin.bank.de.member_details', {
                member: member?.id,
              })}
              className="text-blue-700 underline flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> ফিরে যান
            </Link>
          </div>

          <div className="card bg-base-100 shadow-xl border-t-4 border-info">
            <div className="card-body">
              <h2 className="card-title text-xl text-neutral mb-4 flex items-center gap-2">
                <Edit size={20} className="text-info" /> কিস্তি আদায় আপডেট
              </h2>

              {/* Member & Record Context */}
              <div className="bg-info/5 p-3 rounded-lg mb-6 border border-info/10">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  সদস্য: {member?.name}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Picker (Visible for manual back-dating correction) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black flex items-center gap-2">
                      <Calendar size={16} /> জমার তারিখ{' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered ${errors.last_collecting_date ? 'input-error' : ''}`}
                    value={data.last_collecting_date}
                    onChange={(e) =>
                      setData('last_collecting_date', e.target.value)
                    }
                    required
                  />
                  {errors.last_collecting_date && (
                    <p className="text-error text-xs mt-1">
                      {errors.last_collecting_date}
                    </p>
                  )}
                </div>

                {/* Paid Amount Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black">
                      মোট কিস্তির পরিমাণ (Paid Amount){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="টাকার পরিমাণ"
                    className={`input input-bordered input-lg ${errors.paid_amount ? 'input-error' : ''}`}
                    value={data.paid_amount}
                    onChange={(e) => setData('paid_amount', e.target.value)}
                    required
                    autoFocus
                  />
                  {errors.paid_amount && (
                    <p className="text-error text-xs mt-1">
                      {errors.paid_amount}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black">
                      সুদের পরিমাণ (Interest Paid Amount){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="টাকার পরিমাণ"
                    className={`input input-bordered input-lg ${errors.interest_paid_amount ? 'input-error' : ''}`}
                    value={data.interest_paid_amount}
                    onChange={(e) =>
                      setData('interest_paid_amount', e.target.value)
                    }
                    required
                    autoFocus
                  />
                  {errors.interest_paid_amount && (
                    <p className="text-error text-xs mt-1">
                      {errors.interest_paid_amount}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-info w-full btn-lg text-white"
                >
                  {processing ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'তথ্য আপডেট করুন'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default DEUpdateLoanCollection;
