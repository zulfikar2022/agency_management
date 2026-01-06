import AdminDashboardLayout from '../../AdminDashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft, Edit3, Calendar } from 'lucide-react';

function DEUpdateDepositCollection({
  member,
  depositCollection,
  dataEntryMode = false,
}) {
  // Initialize form with existing record data
  const { data, setData, patch, processing, errors } = useForm({
    deposit_collection_id: depositCollection?.id, // Invisible field
    deposit_amount: depositCollection?.deposit_amount / 100 || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'তথ্য পরিবর্তন নিশ্চিত করুন',
      text: `আপনি কি সঞ্চয় জমার পরিমাণ পরিবর্তন করে ${data.deposit_amount} টাকা করতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        // Using patch for an update request
        patch(route('admin.bank.de.save_updated_deposit_collection'), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('সঞ্চয় জমা সফলভাবে আপডেট করা হয়েছে!', {
              theme: 'dark',
              position: 'top-center',
              transition: Bounce,
            });
          },
          onError: (err) => {
            toast.error('আপডেট ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।', {
              theme: 'dark',
              position: 'top-center',
              transition: Bounce,
            });
          },
        });
      }
    });
  };

  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <Head title="সঞ্চয় জমা আপডেট" />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="mb-4">
            <Link
              href={route('admin.bank.de.member_details', {
                member: member?.id,
              })}
              className="text-blue-700 underline flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> ফিরে যান
            </Link>
          </div>

          <div className="card bg-base-100 shadow-xl border-t-4 border-warning">
            <div className="card-body">
              <h2 className="card-title text-xl text-neutral mb-4 flex items-center gap-2">
                <Edit3 size={20} className="text-warning" /> সঞ্চয় জমা আপডেট
              </h2>

              {/* Record Summary */}
              <div className="bg-warning/5 p-3 rounded-lg mb-6 border border-warning/10">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  সদস্য: {member?.name}
                </p>
                <p className="text-sm text-gray-600">
                  কালেকশন আইডি: #{depositCollection?.id}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Deposit Amount (Visible Field) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black">
                      সঞ্চয়ের পরিমাণ (Deposit Amount){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="টাকার পরিমাণ"
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
                  className="btn btn-warning w-full btn-lg text-neutral"
                >
                  {processing ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'তথ্য আপডেট করুন'
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

export default DEUpdateDepositCollection;
