import Swal from 'sweetalert2';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Head, useForm } from '@inertiajs/react';
import { Bounce, toast } from 'react-toastify';

function DismissDepositAccount({
  member,
  deposit,
  total_day_missed,
  total_withdraw_amount,
  total_withdraw_times,
  total_collected_amount_withing_range,
  lower_amount_days_count_than_promised,
  higher_amount_days_count_than_promised,
}) {
  // Initialize the form
  const { data, setData, post, processing, errors } = useForm({
    deposit_id: deposit.id,
    total_remaining_deposit: (member.total_deposit / 100).toFixed(2), // Storing as readable decimal
    total_paid: '', // User will input this
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      text: `আপনি কি নিশ্চিত যে এই সদস্যের সঞ্চয় একাউন্ট বন্ধ করতে চান এবং তাকে ${data.total_paid} টাকা দিতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আমি নিশ্চিত',
    }).then((result) => {
      if (result.isConfirmed) {
        post(route('admin.bank.deposit_dismissal.store'), {
          preserveScroll: true,
          onSuccess: () => {},
          onError: (error) => {
            toast.error(error?.message || 'একটি ত্রুটি ঘটেছে', {
              position: 'top-center',
              autoClose: 3,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
              transition: Bounce,
            });
          },
        });
      }
    });
  };

  return (
    <LayoutForMoney>
      <Head title="সঞ্চয় একাউন্ট বন্ধকরণ" />
      <div className="container mx-auto my-5 p-4 ">
        <h2 className="text-2xl font-bold text-center mb-6 text-error">
          সঞ্চয় একাউন্ট বন্ধকরণ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-5 border-b pb-8 mb-8">
          <div className="space-y-2">
            <p className="font-bold">
              সদস্যের আইডিঃ <span className="font-normal">{member.id}</span>
            </p>
            <p className="font-bold">
              সদস্যের নামঃ <span className="font-normal">{member.name}</span>
            </p>
            <p className="font-bold">
              দৈনিক প্রতিশ্রুত সঞ্চয়ের পরিমাণঃ{' '}
              <span className="font-normal text-xl">
                {(deposit.daily_deposit_amount / 100).toFixed(2)} টাকা
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold">
              একাউন্টে সঞ্চিত টাকার পরিমাণঃ{' '}
              <span className="font-normal text-xl">
                {(member.total_deposit / 100).toFixed(2)} টাকা
              </span>
            </p>
            <p className="font-bold">
              প্রতিশ্রুত পরিমাণ অনুযায়ী মোট সংগৃহীত সঞ্চয়ঃ{' '}
              <span className="font-normal text-xl text-success">
                {(total_collected_amount_withing_range / 100).toFixed(2)} টাকা
              </span>
            </p>
            <p className="font-bold">
              দৈনিক প্রতিশ্রুত পরিমাণের চেয়ে কম দিয়েছেঃ{' '}
              <span className="font-normal text-xl text-warning">
                {lower_amount_days_count_than_promised} দিন
              </span>
            </p>
            <p className="font-bold">
              দৈনিক প্রতিশ্রুত পরিমাণের চেয়ে বেশি দিয়েছেঃ{' '}
              <span className="font-normal text-xl text-info">
                {higher_amount_days_count_than_promised} দিন
              </span>
            </p>
            <p className="font-bold text-red-600">
              মোট সঞ্চয় দেয়নিঃ{' '}
              <span className="font-normal text-xl">
                {total_day_missed} দিন
              </span>
            </p>
            <p className="font-bold text-red-600">
              মোট টাকা উত্তোলন করেছেঃ{' '}
              <span className="font-normal text-xl">
                {total_withdraw_times} বার
              </span>
            </p>
            <p className="font-bold text-red-600">
              মোট টাকা উত্তোলনের পরিমাণঃ{' '}
              <span className="font-normal text-xl">
                {(total_withdraw_amount / 100).toFixed(2)} টাকা
              </span>
            </p>
          </div>
        </div>

        {/* --- FORM SECTION --- */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-inner">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden Deposit ID */}
            <input type="hidden" value={data.deposit_id} />

            {/* Read Only Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">
                  মোট অবশিষ্ট সঞ্চয় (Read Only)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.total_remaining_deposit}
                  readOnly
                  className="input input-bordered w-full bg-base-300 cursor-not-allowed font-bold text-lg"
                />
                <span className="absolute right-3 top-3 opacity-50">টাকা</span>
              </div>
            </div>

            {/* Writable Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-primary">
                  পরিশোধিত মোট পরিমাণ
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="পরিমাণ লিখুন"
                  value={data.total_paid}
                  onChange={(e) => setData('total_paid', e.target.value)}
                  className={`input input-bordered w-full text-lg ${errors.total_paid ? 'input-error' : ''}`}
                  required
                />
                <span className="absolute right-3 top-3 opacity-50">টাকা</span>
              </div>
              {errors.total_paid && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.total_paid}
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={processing}
                className="btn btn-error btn-block text-white"
              >
                {processing ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'একাউন্ট ক্লোজ করুন'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutForMoney>
  );
}

export default DismissDepositAccount;
