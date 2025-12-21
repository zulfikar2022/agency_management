import { useForm } from '@inertiajs/react';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';

function EmployeeDepositAndLoanCollection({ deposit, loan, member }) {
  //   console.log(deposit, loan);
  // employee.bank.processDepositAndLoanCollection
  const { data, setData, errors, processing } = useForm({
    has_deposit: deposit ? true : false,
    has_loan: loan ? true : false,

    deposit_id: deposit ? deposit.id : null,
    loan_id: loan ? loan.id : null,

    deposit_amount: deposit ? deposit.daily_deposit_amount / 100 : 0,
    paid_amount: loan ? loan.daily_payable_amount / 100 : 0,
  });
  depoist;
  const total_collection =
    (deposit?.daily_deposit_amount / 100 || 0) +
    (loan?.daily_payable_amount / 100 || 0);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
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
                  <span>মোট সংগ্রহঃ </span>
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
                          {loan?.daily_payable_amount / 100} টাকা{' '}
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
                          {deposit?.daily_deposit_amount / 100} টাকা{' '}
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
