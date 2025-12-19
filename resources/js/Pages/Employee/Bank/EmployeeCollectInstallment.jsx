import { useForm } from '@inertiajs/react';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';

function EmployeeCollectInstallment({ member, loan }) {
  const remaining_payable_amount = loan.remaining_payable_amount / 100;
  console.log(remaining_payable_amount);

  const { data, setData, post, processing, errors, reset } = useForm({
    paid_amount:
      remaining_payable_amount >= loan?.daily_payable_amount / 100
        ? loan?.daily_payable_amount / 100
        : remaining_payable_amount || '',
    loan_id: loan?.id,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      text: `${member?.name}-এর নিকট থেকে ${data.paid_amount} টাকা কিস্তি আদায়ের তথ্যটি নিশ্চিত করতে চান?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আদায় করুন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        // Adjust the route name to match your web.php
        post(route('employee.bank.store_installment'), {
          preserveScroll: true,
          onSuccess: () => {
            reset('paid_amount');
            toast.success('কিস্তি আদায় সফলভাবে সম্পন্ন হয়েছে!', {
              position: 'top-center',
              autoClose: 3000,
              theme: 'dark',
              transition: Bounce,
            });
          },
          onError: (error) => {
            console.error('Installment collection failed:', error);
            toast.error(
              error?.paid_amount ||
                ' তথ্য সংরক্ষণ করা যায়নি। পুনরায় চেষ্টা করুন।',
              {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
                transition: Bounce,
              }
            );
          },
        });
      }
    });
  };
  return (
    <EmployeeBankLayout>
      <h1 className="font-bold text-center text-2xl">কিস্তি উত্তোলন</h1>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-xl mx-auto px-4">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              {/* Header section */}
              <div className="text-sm  mb-6">
                <p className="font-bold">
                  {' '}
                  সদস্য:{' '}
                  <span className="font-normal text-lg">
                    {member?.name || 'N/A'}
                  </span>
                </p>
                <p className="font-bold">
                  {' '}
                  আইডি:{' '}
                  <span className="font-normal text-lg">
                    {member?.id || 'N/A'}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Paid Amount Input */}
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text font-bold text-lg">
                      আদায়ের পরিমাণ <span className="text-error">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-lg opacity-50">
                      ৳
                    </span>
                    <input
                      type="number"
                      max={remaining_payable_amount}
                      inputMode="numeric"
                      className={`input input-bordered w-full ${errors.paid_amount ? 'input-error' : ''}`}
                      value={data.paid_amount}
                      onChange={(e) => setData('paid_amount', e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  {errors.paid_amount && (
                    <label className="label">
                      <span className="label-text-alt text-error font-medium">
                        {errors.paid_amount}
                      </span>
                    </label>
                  )}
                </div>

                {/* Submit Action */}
                <div className="card-actions justify-end pt-2">
                  <button
                    type="submit"
                    disabled={processing || !data.paid_amount}
                    className="btn btn-neutral w-full text-sm"
                  >
                    {processing ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'আদায় নিশ্চিত করুন'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </EmployeeBankLayout>
  );
}

export default EmployeeCollectInstallment;
