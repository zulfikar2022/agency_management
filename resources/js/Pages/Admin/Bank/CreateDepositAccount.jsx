import { useForm } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

function CreateDepositAccount({ member }) {
  console.log(member);
  const { data, setData, post, processing, errors, reset } = useForm({
    daily_deposit_amount: '',
    member_id: member?.id || '', // Hidden or contextual field
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      text: `আপনি কি '${member?.name}' নামের সদস্যের জন্য সঞ্চয়ী একাউন্ট তৈরি করতে চান?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, চাই!',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        post(
          route('admin.bank.create_deposit_account', { member: member.id }),
          {
            preserveScroll: true,
            onSuccess: () => {
              reset('daily_deposit_amount');
              toast.success('সঞ্চয়ী একাউন্ট সফলভাবে তৈরি হয়েছে!', {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
                transition: Bounce,
              });
            },
            onError: () => {
              toast.error(
                'সঞ্চয়ী একাউন্ট তৈরি করা ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
                {
                  position: 'top-center',
                  autoClose: 3000,
                  theme: 'dark',
                  transition: Bounce,
                }
              );
            },
          }
        );
      }
    });
  };
  return (
    <LayoutForMoney>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Title & Description */}
              <h2 className="card-title text-2xl mb-2">
                দৈনিক সঞ্চয়ী হিসেব তৈরি করুন
              </h2>
              <p className="text-sm text-base-content/70 mb-6">
                সদস্যের নাম:{' '}
                <span className="font-bold text-base-content">
                  {member?.name || 'আব্দুল করিম'}
                </span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Daily Deposit Amount */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      দৈনিক জমার পরিমাণ (টাকা){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    className={`input input-bordered w-full ${errors.daily_deposit_amount ? 'input-error' : ''}`}
                    value={data.daily_deposit_amount}
                    required
                    onChange={(e) =>
                      setData('daily_deposit_amount', e.target.value)
                    }
                    placeholder="৫০০"
                  />
                  {errors.daily_deposit_amount && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.daily_deposit_amount}
                      </span>
                    </label>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-neutral w-full"
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        প্রসেসিং হচ্ছে...
                      </>
                    ) : (
                      'টাকা জমা দিন'
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

export default CreateDepositAccount;
