import LayoutForMoney from '../layouts/LayoutForMoney';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

function ProvideLoan({ member }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    member_id: member?.id,
    total_loan: '',
    safety_money: '',
  });

  // Automatic Calculations
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
        post(route('admin.bank.store_loan'), {
          preserveScroll: true,
          onSuccess: (data) => {
            reset();
            toast.success('ঋণ প্রদান সফল হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
          onError: (error) => {
            toast.error(
              error?.message || 'ঋণ প্রদান ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
              {
                theme: 'dark',
                transition: Bounce,
                position: 'top-center',
              }
            );
          },
        });
      }
    });
  };

  return (
    <LayoutForMoney>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2 text-neutral">
                সদস্যকে ঋণ দিন
              </h2>
              <div className="text-sm mb-6 border-b pb-4">
                <p className="font-bold">
                  {' '}
                  সদস্যের নাম:{' '}
                  <span className="font-normal text-lg">{member?.name}</span>
                </p>
                <p className="font-bold">
                  সদস্য আইডি:{' '}
                  <span className="font-normal text-lg">{member?.id}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Loan Amount & Safety Money */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
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

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        জামানত (Safety Money){' '}
                        <span className="text-error">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 500"
                      className={`input input-bordered ${errors.safety_money ? 'input-error' : ''}`}
                      value={data.safety_money}
                      onChange={(e) => setData('safety_money', e.target.value)}
                      required
                    />
                    {errors.safety_money && (
                      <p className="text-error text-xs mt-1">
                        {errors.safety_money}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Automatic Read-Only Calculations */}
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

                {/* Submit Button */}
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
    </LayoutForMoney>
  );
}

export default ProvideLoan;
