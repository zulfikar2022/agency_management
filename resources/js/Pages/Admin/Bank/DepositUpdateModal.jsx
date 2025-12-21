import { useForm } from '@inertiajs/react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { useEffect } from 'react';

function DepositUpdateModal({ open, onCloseModal, deposit }) {
  // collection is the deposit collection instance passed when the pencil icon is clicked
  const { data, setData, patch, processing, errors, reset } = useForm({
    daily_deposit_amount: deposit ? deposit.daily_deposit_amount / 100 : '',
    deposit_id: deposit ? deposit.id : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      text: 'আপনি কি সঞ্চয় জমার পরিমাণ পরিবর্তন করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন!',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Submitting update with data:', data);
        // Replace with your specific route for updating deposit collections
        patch(route('admin.bank.update_deposit'), {
          preserveScroll: true,
          onSuccess: () => {
            onCloseModal();
            toast.success('সঞ্চয় সফলভাবে আপডেট করা হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
          onError: (err) => {
            toast.error(
              err?.daily_deposit_amount ||
                'আপডেট করতে ব্যর্থ হয়েছে। তথ্য যাচাই করুন।',
              {
                theme: 'dark',
                position: 'top-center',
              }
            );
          },
        });
      }
    });
  };

  return (
    <Modal
      styles={{
        modal: {
          minWidth: '350px',
          borderRadius: '12px',
          padding: '0px',
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
      open={open}
      onClose={onCloseModal}
      center
      showCloseIcon={true}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-neutral">
          সঞ্চয় একাউন্ট আপডেট করুন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Visible Field: Deposit Amount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">
                সঞ্চয়ের পরিমাণ (টাকা)
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">৳</span>
              <input
                type="number"
                inputMode="numeric"
                className={`input input-bordered w-full pl-8 ${errors.daily_deposit_amount ? 'input-error' : ''}`}
                value={data.daily_deposit_amount}
                onChange={(e) =>
                  setData('daily_deposit_amount', e.target.value)
                }
                placeholder="পরিমাণ লিখুন"
                required
              />
            </div>
            {errors?.daily_deposit_amount && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors?.daily_deposit_amount}
                </span>
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-2">
            <button
              type="button"
              onClick={onCloseModal}
              className="btn btn-ghost flex-1"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              disabled={processing}
              className="btn btn-neutral flex-1"
            >
              {processing ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'আপডেট করুন'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default DepositUpdateModal;
