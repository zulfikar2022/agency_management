import { useForm } from '@inertiajs/react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

function DepositCollectionUpdateModal({ open, onCloseModal, collection }) {
  // Initialize Inertia form
  const { data, setData, patch, processing, errors } = useForm({
    deposit_amount: collection ? collection.deposit_amount / 100 : '',
    id: collection?.id || '',
  });

  // Sync data when collection prop changes (if modal opens for different rows)
  // Note: Since collection changes when clicking different rows, we use local state or key

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      text: 'আপনি কি জমার পরিমাণ পরিবর্তন করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন!',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        // Replace 'admin.deposits.update' with your actual route name
        patch(
          route('employee.bank.update_deposit', {
            depositCollection: collection?.id,
          }),
          {
            preserveScroll: true,
            onSuccess: () => {
              onCloseModal();
              toast.success('সঞ্চয় সফলভাবে আপডেট করা হয়েছে!', {
                theme: 'dark',
                transition: Bounce,
                position: 'top-center',
              });
            },
            onFailure: (error) => {
              toast.error(
                error?.deposit_amount ||
                  'সঞ্চয় আপডেট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
                {
                  theme: 'dark',
                  transition: Bounce,
                  position: 'top-center',
                }
              );
            },
          }
        );
      }
    });
  };

  return (
    <Modal
      styles={{
        modal: {
          minWidth: '350px',
          borderRadius: '12px',
          padding: '0px', // Padding handled by internal div for better control
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
      open={open}
      onClose={onCloseModal}
      center
      showCloseIcon={true}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">
          সঞ্চয় আপডেট করুন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">জমার পরিমাণ (টাকা)</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              className={`input input-bordered w-full ${errors.deposit_amount ? 'input-error' : ''}`}
              value={data.deposit_amount}
              onChange={(e) => setData('deposit_amount', e.target.value)}
              placeholder="পরিমাণ লিখুন"
              required
            />
            {errors.deposit_amount && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.deposit_amount}
                </span>
              </label>
            )}
          </div>

          {/* Submit Action */}
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
export default DepositCollectionUpdateModal;
