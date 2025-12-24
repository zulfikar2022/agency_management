import { useForm } from '@inertiajs/react';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

function EmployeeDepositAndLoanCollection({ deposit, loan, member }) {
  //   console.log(deposit, loan);
  // employee.bank.processDepositAndLoanCollection
  const { data, setData, errors, post, processing, reset } = useForm({
    has_deposit: deposit ? true : false,
    has_loan: loan ? true : false,

    deposit_id: deposit ? deposit?.id : null,
    loan_id: loan ? loan?.id : null,

    deposit_amount: deposit ? deposit.daily_deposit_amount / 100 : 0,
    paid_amount: loan ? loan.daily_payable_amount / 100 : 0,
  });
  depoist;
  const total_collection =
    (deposit?.daily_deposit_amount / 100 || 0) +
    (loan?.daily_payable_amount / 100 || 0);
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      text: `${member?.name}-এর নিকট থেকে আদায়ের তথ্যটি নিশ্চিত করতে চান?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আদায় করুন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        // Adjust the route name to match your web.php
        post(route('employee.bank.processDepositAndLoanCollection'), {
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
      <p className="text-center font-bold text-xl">
        দৈনিক সঞ্চয় {loan && <span>ও ঋণ কিস্তি</span>} সংগ্রহ
      </p>
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
                <p className="font-bold">
                  <span>মোট দৈনিক সংগ্রহঃ </span>
                  <span className="font-normal">{total_collection} টাকা</span>
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Paid Amount Input */}
                {loan && (
                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text font-bold text-lg">
                        ঋণের কিস্তি সংগ্রহ <span className="text-error">*</span>
                        <br />
                        <span className="text-xs">
                          দৈনিক কিস্তির পরিমাণঃ{' '}
                          {(loan?.daily_payable_amount / 100).toFixed(2)}{' '}
                          টাকা{' '}
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-lg opacity-50">
                        ৳
                      </span>
                      <input
                        type="number"
                        max={loan?.remaining_payable_amount}
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
                )}
                {deposit && (
                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text font-bold text-lg">
                        দৈনিক সঞ্চয় সংগ্রহঃ{' '}
                        <span className="text-error">*</span>
                        <br />
                        <span className="text-xs">
                          দৈনিক সঞ্চয়ের পরিমাণঃ{' '}
                          {(deposit?.daily_deposit_amount / 100).toFixed(2)}{' '}
                          টাকা{' '}
                        </span>
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-lg opacity-50">
                        ৳
                      </span>
                      <input
                        type="number"
                        max={loan?.remaining_payable_amount}
                        inputMode="numeric"
                        className={`input input-bordered w-full ${errors.deposit_amount ? 'input-error' : ''}`}
                        value={data.deposit_amount}
                        onChange={(e) =>
                          setData('deposit_amount', e.target.value)
                        }
                        required
                        autoFocus
                      />
                    </div>
                    {errors.deposit_amount && (
                      <label className="label">
                        <span className="label-text-alt text-error font-medium">
                          {errors.deposit_amount}
                        </span>
                      </label>
                    )}
                  </div>
                )}

                {/* Submit Action */}
                <div className="card-actions justify-end pt-2">
                  <button
                    type="submit"
                    disabled={processing}
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

export default EmployeeDepositAndLoanCollection;
