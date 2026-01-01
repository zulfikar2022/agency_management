import { Head, Link, useForm } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { ArrowLeft } from 'lucide-react';

function WithdrawUpdate({ withdraw, member, deposit }) {
  // withdraw is the instance passed from Laravel Controller
  const { data, setData, patch, processing, errors } = useForm({
    // Pre-loading the amount (converting from paisa to Taka)
    withdraw_amount: withdraw?.withdraw_amount
      ? withdraw.withdraw_amount / 100
      : '',
    withdraw_id: withdraw?.id, // Invisible value
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'সংশোধন নিশ্চিতকরণ',
      text: `আপনি কি উত্তোলনের পরিমাণ পরিবর্তন করে ${data.withdraw_amount} টাকা করতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন',
      cancelButtonText: 'বাতিল',
    }).then((result) => {
      if (result.isConfirmed) {
        // Using patch for updates as per standard Laravel REST practices
        patch(
          route('admin.bank.update_withdraw', data.withdraw_id, {
            withdraw: withdraw?.id,
          }),
          {
            preserveScroll: true,
            onSuccess: () => {
              toast.success('উত্তোলন সফলভাবে আপডেট করা হয়েছে!', {
                position: 'top-center',
                theme: 'dark',
                transition: Bounce,
              });
            },
            onError: (error) => {
              toast.error(
                error?.withdraw_amount ||
                  'আপডেট ব্যর্থ হয়েছে। তথ্য যাচাই করুন।',
                { position: 'top-center' }
              );
            },
          }
        );
      }
    });
  };

  return (
    <LayoutForMoney>
      <Head title="উত্তোলন সংশোধন করুন" />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="pl-10 mt-4">
          <Link
            href={route('admin.bank.withdraw_lists', {
              deposit: deposit?.id,
            })}
            className="text-blue-700 underline "
          >
            {' '}
            <span className="flex">
              <ArrowLeft /> <span>ফিরে যান</span>
            </span>{' '}
          </Link>
        </div>
        <div className="max-w-xl mx-auto px-4">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              {/* Header */}
              <h2 className="card-title text-2xl mb-1 text-black">
                উত্তোলন সংশোধন (Update Withdraw)
              </h2>

              <div className="text-sm mb-6 border-b pb-4">
                <p className="font-bold text-gray-700">
                  সদস্যঃ{' '}
                  <span className="font-normal text-lg">{member?.name}</span>
                </p>
                <p className="font-bold text-gray-700">
                  সদস্য আইডিঃ{' '}
                  <span className="font-normal text-lg">{member?.id}</span>
                </p>
                <p className="font-bold text-gray-700">
                  বর্তমান মোট সঞ্চয়ঃ{' '}
                  <span className="font-normal text-lg text-green-700">
                    {(member?.total_deposit / 100).toLocaleString()} টাকা
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Withdraw Amount Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black font-bold text-lg">
                      সংশোধিত উত্তোলনের পরিমাণ{' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-lg opacity-50">
                      ৳
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`input input-bordered w-full  text-lg ${
                        errors.withdraw_amount ? 'input-error' : ''
                      }`}
                      value={data.withdraw_amount}
                      onChange={(e) =>
                        setData('withdraw_amount', e.target.value)
                      }
                      required
                    />
                  </div>
                  {errors.withdraw_amount && (
                    <label className="label">
                      <span className="label-text-alt text-error font-medium">
                        {errors.withdraw_amount}
                      </span>
                    </label>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={processing || !data.withdraw_amount}
                    className={`btn ${
                      !data?.withdraw_amount ? 'btn-disabled' : 'btn-neutral'
                    } w-full text-lg shadow-lg text-white font-bold`}
                  >
                    {processing ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'তথ্য আপডেট করুন'
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

export default WithdrawUpdate;
