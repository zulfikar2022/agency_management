import AdminDashboardLayout from '../../AdminDashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

function DEProvideLoan({ member }) {
  const [isSafetyMoneyManual, setIsSafetyMoneyManual] = useState(false);

  // Get current date in YYYY-MM-DD format for the input default
  const today = new Date().toISOString().split('T')[0];

  const { data, setData, post, processing, errors, reset } = useForm({
    member_id: member?.id,
    total_loan: '',
    safety_money: '',
    created_at: today, // Added date field with today as default
  });

  useEffect(() => {
    if (!isSafetyMoneyManual && data.total_loan) {
      const calculatedSafety = (parseFloat(data.total_loan) / 1000) * 150;
      setData('safety_money', calculatedSafety);
    } else if (!isSafetyMoneyManual && !data.total_loan) {
      setData('safety_money', '');
    }
  }, [data.total_loan, isSafetyMoneyManual]);

  const totalPayable = data.total_loan ? parseFloat(data.total_loan) * 1.15 : 0;
  const shareMoney = data.total_loan ? parseFloat(data.total_loan) * 0.025 : 0;
  const loanFee = 30;
  const dailyPayable = totalPayable > 0 ? totalPayable / 115 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'ঋণ নিশ্চিত করুন',
      text: `${data.total_loan} টাকা ঋণের বিপরীতে মোট ${totalPayable.toFixed(2)} টাকা পরিশোধযোগ্য। আপনি কি নিশ্চিত?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, ঋণ প্রদান করুন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Submitting loan data:', data);
        post(route('admin.bank.de.save_loan'), {
          preserveScroll: true,
          onSuccess: () => {
            reset();
            setIsSafetyMoneyManual(false);
            toast.success('ঋণ প্রদান সফল হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
          onError: (error) => {
            toast.error(error?.message || 'ঋণ প্রদান ব্যর্থ হয়েছে।', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
        });
      }
    });
  };
  return (
    <AdminDashboardLayout>
      <Head title="সদস্যকে ঋণ দিন" />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="pl-10 mt-4">
          <Link
            href={route('admin.bank.member_details', { member: member?.id })}
            className="text-blue-700 underline flex items-center gap-1"
          >
            <ArrowLeft size={18} /> <span>ফিরে যান</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2 text-neutral">
                সদস্যকে ঋণ দিন
              </h2>

              <div className="text-sm mb-6 border-b pb-4">
                <p className="font-bold text-gray-600">
                  সদস্যের নাম:{' '}
                  <span className="font-normal text-black text-lg">
                    {member?.name}
                  </span>
                </p>
                <p className="font-bold text-gray-600">
                  সদস্য আইডি:{' '}
                  <span className="font-normal text-black text-lg">
                    {member?.id}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Date Selection - New Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-black flex items-center gap-2">
                      <Calendar size={16} /> ঋণের তারিখ (Date){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered ${errors.created_at ? 'input-error' : ''}`}
                    value={data.created_at}
                    onChange={(e) => setData('created_at', e.target.value)}
                    required
                  />
                  {errors.created_at && (
                    <p className="text-error text-xs mt-1">
                      {errors.created_at}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Loan Amount */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-black">
                        ঋণের পরিমাণ (Total Loan){' '}
                        <span className="text-error">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 10000"
                      className={`input input-bordered ${errors.total_loan ? 'input-error' : ''}`}
                      value={data.total_loan}
                      onChange={(e) => setData('total_loan', e.target.value)}
                      required
                    />
                    {errors.total_loan && (
                      <p className="text-error text-xs mt-1">
                        {errors.total_loan}
                      </p>
                    )}
                  </div>

                  {/* Safety Money */}
                  <div className="form-control">
                    <label className="label flex justify-between">
                      <span className="label-text font-semibold text-black">
                        জামানত (Safety Money){' '}
                        <span className="text-error">*</span>
                      </span>
                      {isSafetyMoneyManual && (
                        <button
                          type="button"
                          onClick={() => setIsSafetyMoneyManual(false)}
                          className="text-[10px] text-blue-600 underline"
                        >
                          অটো ক্যালকুলেট ফিরিয়ে আনুন
                        </button>
                      )}
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 500"
                      className={`input input-bordered ${errors.safety_money ? 'input-error' : ''} ${!isSafetyMoneyManual ? 'bg-blue-50/30' : ''}`}
                      value={data.safety_money}
                      onChange={(e) => {
                        setIsSafetyMoneyManual(true);
                        setData('safety_money', e.target.value);
                      }}
                      required
                    />
                    {errors.safety_money && (
                      <p className="text-error text-xs mt-1">
                        {errors.safety_money}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info Cards Section remains unchanged... */}
                <div className="bg-base-200 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs">
                        মোট পরিশোধযোগ্য (১১৫%):
                      </span>
                    </label>
                    <div className="bg-white px-4 py-2 rounded border font-bold text-neutral">
                      ৳ {totalPayable.toLocaleString()}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs">
                        দৈনিক কিস্তি (১১৫ দিন):
                      </span>
                    </label>
                    <div className="bg-white px-4 py-2 rounded border font-bold text-success">
                      ৳ {dailyPayable.toFixed(2)}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs">
                        শেয়ার জমা (২.৫%):
                      </span>
                    </label>
                    <div className="bg-white px-4 py-2 rounded border text-sm italic">
                      ৳ {shareMoney.toFixed(2)}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs">ঋণ ফরম ফি:</span>
                    </label>
                    <div className="bg-white px-4 py-2 rounded border text-sm">
                      ৳ {loanFee}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-neutral w-full text-lg"
                  >
                    {processing ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'ঋণ প্রদান নিশ্চিত করুন'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default DEProvideLoan;
