import AdminDashboardLayout from '../../AdminDashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft, Landmark, Calendar } from 'lucide-react';

function DECollectDeposit({ member, dataEntryMode = false }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    member_id: member?.id, // Invisible item
    deposit_amount: '', // Visible field
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'সঞ্চয় জমা নিশ্চিত করুন',
      text: `${member?.name} এর অ্যাকাউন্টে ${data.deposit_amount} টাকা সঞ্চয় জমা করা হচ্ছে। আপনি কি নিশ্চিত?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, জমা দিন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        post(route('admin.bank.de.save_deposit'), {
          preserveScroll: true,
          onSuccess: () => {
            reset('deposit_amount');
            toast.success('সঞ্চয় জমা সফল হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
          onError: (err) => {
            toast.error(err?.message || 'জমা ব্যর্থ হয়েছে।', {
              theme: 'dark',
              position: 'top-center',
            });
          },
        });
      }
    });
  };

  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <Head title="সঞ্চয় জমা করুন" />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="mb-4">
            <Link
              href={route('admin.bank.de.all_members')}
              className="text-blue-700 underline flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> ফিরে যান
            </Link>
          </div>

          <div className="card bg-base-100 shadow-xl border-t-4 border-success">
            <div className="card-body">
              <h2 className="card-title text-xl text-neutral mb-4 flex items-center gap-2">
                <Landmark size={20} className="text-success" /> সঞ্চয় জমা
                (Deposit)
              </h2>

              {/* Member Info Card */}
              <div className="bg-success/5 p-3 rounded-lg mb-6 border border-success/10">
                <p className="text-xs text-gray-500 uppercase font-bold text-success">
                  সদস্য তথ্য
                </p>
                <p className="font-bold text-lg text-neutral">{member?.name}</p>
                <p className="text-sm text-gray-600 font-mono">
                  ID: {member?.id}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Deposit Amount */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black">
                      মোট সঞ্চয়ের পরিমাণ (Deposit Amount){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder=""
                    className={`input input-bordered input-lg ${errors.deposit_amount ? 'input-error' : ''}`}
                    value={data.deposit_amount}
                    onChange={(e) => setData('deposit_amount', e.target.value)}
                    required
                    autoFocus
                  />
                  {errors.deposit_amount && (
                    <p className="text-error text-xs mt-1">
                      {errors.deposit_amount}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-success w-full btn-lg text-white"
                >
                  {processing ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'সঞ্চয় জমা নিশ্চিত করুন'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default DECollectDeposit;
