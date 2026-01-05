import AdminDashboardLayout from '../../AdminDashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft, Wallet, Calendar } from 'lucide-react'; // Added Calendar icon

function DECollectLoanCollection({ member, dataEntryMode = false }) {
  // Default to today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const { data, setData, post, processing, errors, reset } = useForm({
    member_id: member?.id,
    paid_amount: '',
    last_collecting_date: today, // Added the new date field
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'কিস্তি নিশ্চিত করুন',
      text: `${member?.name} এর কাছ থেকে ${data.last_collecting_date} তারিখের জন্য ${data.paid_amount} টাকা সংগ্রহ করা হচ্ছে। আপনি কি নিশ্চিত?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, জমা দিন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        post(route('admin.bank.de.collect_loan_save'), {
          preserveScroll: true,
          onSuccess: () => {
            reset('paid_amount');
            toast.success('কিস্তি সফলভাবে সংগ্রহ করা হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
          onError: (err) => {
            toast.error(
              err?.message ||
                err?.last_collecting_date ||
                'সংগ্রহ ব্যর্থ হয়েছে।',
              {
                theme: 'dark',
                position: 'top-center',
              }
            );
          },
        });
      }
    });
  };

  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="mb-4">
            <Link
              href={route('admin.bank.de.all_members')}
              className="text-blue-700 underline flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> ফিরে যান
            </Link>
          </div>

          <div className="card bg-base-100 shadow-xl border-t-4 border-neutral">
            <div className="card-body">
              <h2 className="card-title text-xl text-neutral mb-4 flex items-center gap-2">
                <Wallet size={20} /> কিস্তি সংগ্রহ
              </h2>

              {/* Member Summary */}
              <div className="bg-neutral/5 p-3 rounded-lg mb-6">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  সদস্য
                </p>
                <p className="font-bold text-lg">{member?.name}</p>
                <p className="text-sm text-gray-600">ID: {member?.id}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Date Field (last_collecting_date) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black flex items-center gap-2">
                      <Calendar size={16} /> শেষ কিস্তির তারিখ (Date){' '}
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

                {/* 2. Paid Amount Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black">
                      কিস্তির পরিমাণ (Amount){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="টাকার পরিমাণ লিখুন"
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

                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-neutral w-full btn-lg"
                >
                  {processing ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'কিস্তি জমা নিন'
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

export default DECollectLoanCollection;
