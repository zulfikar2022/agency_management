import { useForm } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

function DeleteMemberAccount({ member, total_share_money }) {
  const {
    data,
    setData,
    post,
    delete: destroy,
    processing,
    errors,
  } = useForm({
    provided_share_money: total_share_money || 0,
    member_id: member.id, // Passing the ID hiddenly
  });

  // 2. Handle the submission with a safety confirmation
  const handleSubmit = (e) => {
    e.preventDefault();
    //admin.bank.delete_member_account
    Swal.fire({
      text: 'আপনি কি নিশ্চিত যে আপনি এই সদস্যের একাউন্ট ডিলিট করতে চান? এটি পূর্বাবস্থায় ফিরানো যাবে না!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'oklch(0.14 0 0)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route('admin.bank.delete_member_account', member.id), {
          onSuccess: () => {
            Swal.fire(
              'ডিলিটেড!',
              'সদস্যের একাউন্ট সফলভাবে ডিলিট করা হয়েছে।',
              'success'
            );
          },
          onError: (error) => {
            toast.error(error?.error || 'ডিলিট করতে সমস্যা হয়েছে', {
              position: 'top-center',
              autoClose: 5000,
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
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-300 border border-red-700 shadow-xl rounded-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">
            সদস্য একাউন্ট ডিলিট
          </h2>
          <p className="font-bold mt-1">
            সদস্যের নাম: <span className="font-normal"> {member.name}</span>
          </p>
          <p className="font-bold mt-1">
            সদস্যের আইডি: <span className="font-normal"> {member.id}</span>
          </p>
          <p className="font-bold mt-1">
            শেয়ার বাবদ জমা আছে:{' '}
            <span className="font-normal"> {total_share_money} টাকা</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provided Share Money Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              শেয়ার বাবদ প্রদানকৃত টাকা
            </label>
            <input
              type="number"
              step="1"
              min={0}
              value={data.provided_share_money}
              onChange={(e) => setData('provided_share_money', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition ${
                errors.provided_share_money
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="টাকার পরিমাণ লিখুন"
              required
            />
            {errors.provided_share_money && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.provided_share_money}
              </p>
            )}
          </div>

          {/* Delete Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-red-200"
            >
              {processing ? 'প্রসেসিং হচ্ছে...' : 'একাউন্ট ডিলিট করুন'}
            </button>
          </div>
        </form>
      </div>
    </LayoutForMoney>
  );
}

export default DeleteMemberAccount;
