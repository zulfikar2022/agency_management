import { Link, useForm } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { ArrowLeft } from 'lucide-react';

function WithdrawMoney({ member, deposit_id }) {
  // deposit_id is passed from Laravel Controller
  const { data, setData, post, processing, errors, reset } = useForm({
    withdraw_amount: '',
    deposit_id: deposit_id, // Invisible value
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'উত্তোলন নিশ্চিতকরণ',
      text: `${member?.name}-এর সঞ্চয় থেকে ${data.withdraw_amount} টাকা উত্তোলন করতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, উত্তোলন করুন',
      cancelButtonText: 'বাতিল',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Form submitted:', data);
        // Replace with your actual route name
        post(route('admin.bank.store_withdraw_money'), {
          preserveScroll: true,
          onSuccess: () => {
            reset('withdraw_amount');
            toast.success('টাকা উত্তোলন সফল হয়েছে!', {
              position: 'top-center',
              theme: 'dark',
              position: 'top-center',
              transition: Bounce,
            });
          },
          onError: (error) => {
            toast.error(
              error?.withdraw_amount ||
                'উত্তোলন ব্যর্থ হয়েছে। পর্যাপ্ত ব্যালেন্স আছে কি না যাচাই করুন।',
              {
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
        <div className="pl-10 mt-4">
          <Link
            href={route('admin.bank.member_details', {
              member: member?.id,
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
          <div className="card  border border-base-300">
            <div className="card-body">
              {/* Header */}
              <h2 className="card-title text-2xl mb-1 text-red-600">
                টাকা উত্তোলন (Withdraw)
              </h2>
              <div className="text-sm  mb-6 border-b pb-4">
                <p className="font-bold">
                  সদস্যঃ{' '}
                  <span className="font-normal text-lg">
                    {member?.name}
                  </span>{' '}
                </p>
                <p className="font-bold">
                  সদস্য আইডিঃ{' '}
                  <span className="font-normal text-lg">{member?.id}</span>{' '}
                </p>
                <p className="font-bold">
                  মোট সঞ্চিত আছেঃ{' '}
                  <span className="font-normal text-lg">
                    {member?.total_deposit / 100} টাকা
                  </span>{' '}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Withdraw Amount Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black font-bold text-lg">
                      উত্তোলনের পরিমাণ <span className="text-error">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-lg opacity-50">
                      ৳
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="1000"
                      className={`input input-bordered w-full text-lg ${errors.withdraw_amount ? 'input-error' : ''}`}
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
                    className={`btn ${!data?.withdraw_amount ? 'btn-disabled' : 'bg-red-700'} w-full text-lg shadow-lg text-white`}
                  >
                    {processing ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'উত্তোলন নিশ্চিত করুন'
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

export default WithdrawMoney;
