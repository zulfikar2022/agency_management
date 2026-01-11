import { Head, useForm } from '@inertiajs/react';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

function EmployeeCollectDeposit({ member, deposit }) {
  //   console.log(deposit);
  const { data, setData, post, processing, errors, reset } = useForm({
    deposit_amount: deposit?.daily_deposit_amount / 100 || '',
    deposit_id: deposit?.id, // Invisible value
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      text: `আপনি কি ${data.deposit_amount} টাকা জমার তথ্যটি নিশ্চিত করতে চান?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, নিশ্চিত করুন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(data);
        // Replace 'admin.bank.storeSpecificDeposit' with your actual route
        post(route('employee.bank.store_deposit'), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('জমা সফলভাবে সম্পন্ন হয়েছে!', {
              position: 'top-center',
              autoClose: 3000,
              theme: 'dark',
              transition: Bounce,
            });
          },
          onError: (error) => {
            console.error('Deposit failed:', error);
            toast.error(
              error?.deposit_amount ||
                'জমা করতে ব্যর্থ হয়েছে। তথ্য যাচাই করুন।',
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
      <Head title="সঞ্চয় জমা" />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Title & Context */}
              <h2 className="card-title text-2xl mb-2">সঞ্চয় জমা</h2>
              <p className="font-bold">
                সদস্য:{' '}
                <span className="font-normal text-xl">
                  {member?.name || 'সদস্যের নাম'}
                </span>
                <br />
                <span className="font-bold">আইডি:</span>{' '}
                <span className="text-xl font-normal">{deposit?.id}</span>
                <br />
                <span className="font-bold">দৈনিক জমা:</span>{' '}
                <span className="text-xl font-normal">
                  {deposit?.daily_deposit_amount / 100 || '0'} টাকা
                </span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Deposit Amount */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      জমার পরিমাণ <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className={`input input-bordered w-full ${errors.deposit_amount ? 'input-error' : ''}`}
                    value={data.deposit_amount}
                    required
                    onChange={(e) => setData('deposit_amount', e.target.value)}
                    placeholder="অংকটি লিখুন (যেমন: ৫০০)"
                  />
                  {errors.deposit_amount && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.deposit_amount}
                      </span>
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-neutral w-full"
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        প্রসেসিং...
                      </>
                    ) : (
                      'জমা নিশ্চিত করুন'
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

export default EmployeeCollectDeposit;
