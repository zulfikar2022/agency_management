import LayoutForMoney from '../layouts/LayoutForMoney';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

function UpdateLoan({ member, loan }) {
  // We start with manual as false so the calculation logic is active by default
  const [isSafetyMoneyManual, setIsSafetyMoneyManual] = useState(false);

  const { data, setData, patch, processing, errors } = useForm({
    loan_id: loan?.id,
    total_loan: loan?.total_loan / 100 || '',
    safety_money: loan?.safety_money / 100 || '',
  });

  // Automatic Calculation Logic
  // This runs whenever total_loan changes, as long as the user hasn't manually edited safety_money
  useEffect(() => {
    if (!isSafetyMoneyManual && data.total_loan) {
      const calculatedSafety = (parseFloat(data.total_loan) / 1000) * 150;
      // Only update if the calculated value is different to avoid infinite loops
      if (calculatedSafety !== parseFloat(data.safety_money)) {
        setData('safety_money', calculatedSafety);
      }
    }
  }, [data.total_loan, isSafetyMoneyManual]);

  // Calculations for display/UI feedback
  const totalPayable = data.total_loan ? parseFloat(data.total_loan) * 1.15 : 0;
  const shareMoney = data.total_loan ? parseFloat(data.total_loan) * 0.025 : 0;
  const loanFee = 30;
  const dailyPayable = totalPayable > 0 ? totalPayable / 115 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'ঋণ সংশোধন নিশ্চিত করুন',
      text: `আপনি কি ঋণের তথ্য পরিবর্তন করতে চান? বর্তমান পরিশোধযোগ্য: ৳${totalPayable.toFixed(2)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন',
      cancelButtonText: 'বাতিল',
    }).then((result) => {
      if (result.isConfirmed) {
        patch(route('admin.bank.update_loan', loan.id), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('ঋণের তথ্য সফলভাবে আপডেট করা হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
          onError: (error) => {
            toast.error(error?.message || 'আপডেট ব্যর্থ হয়েছে।', {
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
    <LayoutForMoney>
      <Head title="ঋণ তথ্য সংশোধন করুন" />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="pl-10 mt-4">
          <Link
            href={route('admin.bank.member_details', { member: member?.id })}
            className="text-blue-700 underline flex items-center gap-1 w-fit"
          >
            <ArrowLeft size={18} /> <span>ফিরে যান</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-4">
          <div className="card bg-base-100 shadow-xl border border-blue-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2 text-blue-700">
                ঋণ তথ্য সংশোধন করুন
              </h2>

              <div className="text-sm mb-6 border-b pb-4">
                <p className="font-bold text-gray-600">
                  সদস্যের নাম:{' '}
                  <span className="font-normal text-black text-lg">
                    {member?.name}
                  </span>
                </p>
                <p className="font-bold text-gray-600">
                  সদস্যের আইডি:{' '}
                  <span className="font-normal text-black text-lg">
                    {member?.id}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                  {/* Safety Money (Hybrid Field) */}
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
                          className="text-[10px] text-blue-600 underline font-bold"
                        >
                          অটো ক্যালকুলেট চালু করুন
                        </button>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className={`input input-bordered w-full ${errors.safety_money ? 'input-error' : ''} ${!isSafetyMoneyManual ? 'bg-blue-50/50 italic' : ''}`}
                        value={data.safety_money}
                        onChange={(e) => {
                          setIsSafetyMoneyManual(true); // User started typing, stop auto-calc
                          setData('safety_money', e.target.value);
                        }}
                        required
                      />
                      {!isSafetyMoneyManual && (
                        <div className="absolute right-3 top-3">
                          <span className="badge badge-info badge-xs text-[8px] text-white">
                            AUTO
                          </span>
                        </div>
                      )}
                    </div>
                    {errors.safety_money && (
                      <p className="text-error text-xs mt-1">
                        {errors.safety_money}
                      </p>
                    )}
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs font-bold text-blue-800">
                        মোট পরিশোধযোগ্য (১১৫%):
                      </span>
                    </label>
                    <div className="bg-white px-4 py-2 rounded border font-bold text-neutral">
                      ৳ {totalPayable.toLocaleString()}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs font-bold text-blue-800">
                        দৈনিক কিস্তি:
                      </span>
                    </label>
                    <div className="bg-white px-4 py-2 rounded border font-bold text-success">
                      ৳ {dailyPayable.toFixed(2)}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs font-bold text-blue-800">
                        শেয়ার জমা (২.৫%):
                      </span>
                    </label>
                    <div className="bg-white px-4 py-2 rounded border text-sm italic">
                      ৳ {shareMoney.toFixed(2)}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs font-bold text-blue-800">
                        ফরম ফি:
                      </span>
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
                    className="btn btn-neutral w-full text-lg shadow-md"
                  >
                    {processing ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'ঋণ তথ্য আপডেট করুন'
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

export default UpdateLoan;
