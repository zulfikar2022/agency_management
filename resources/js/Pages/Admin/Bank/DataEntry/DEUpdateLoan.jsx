import AdminDashboardLayout from '../../AdminDashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft, Edit, Calendar, Banknote } from 'lucide-react';
import { dateFormatter } from '@/utilityFuntion';

function DEUpdateLoan({
  dataEntryMode = false,
  member,
  loan,
  loanCollections,
}) {
  const total_main_paid = loanCollections.reduce(
    (sum, collection) => sum + collection.main_paid_amount,
    0
  );

  const total_interest_paid = loanCollections.reduce(
    (sum, collection) => sum + collection.interest_paid_amount,
    0
  );
  const total_paid = loanCollections.reduce(
    (sum, collection) => sum + collection.paid_amount,
    0
  );
  // Get today's date in YYYY-MM-DD format for the default value
  const today = new Date().toISOString().split('T')[0];
  const { data, setData, patch, processing, errors } = useForm({
    loan_id: loan?.id, // Invisible identifier
    member_id: member?.id, // Invisible identifier

    // Per your instruction: get total_loan from member
    total_loan: member?.total_loan / 100 || '',

    // Other fields from the loan object
    daily_payable_main: loan?.daily_payable_main / 100 || '',
    daily_payable_interest: loan?.daily_payable_interest / 100 || '',
    remaining_payable_main: loan?.remaining_payable_main / 100 || '',
    remaining_payable_interest: loan?.remaining_payable_interest / 100 || '',
    total_paid: loan?.total_paid / 100 || '',
    // Date picker defaulting to today
    last_paying_date: today,
  });

  // console.log(data);

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'ঋণ আপডেট নিশ্চিত করুন',
      text: `আপনি কি ${member?.name}-এর ঋণের তথ্য পরিবর্তন করতে নিশ্চিত?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        // Assuming a route for saving the update. Adjust route name if needed.
        patch(route('admin.bank.de.update_loan_save'), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('ঋণের তথ্য সফলভাবে আপডেট করা হয়েছে!', {
              theme: 'dark',
              transition: Bounce,
              position: 'top-center',
            });
          },
          onError: (err) => {
            toast.error('আপডেট ব্যর্থ হয়েছে। দয়া করে ইনপুট যাচাই করুন।', {
              theme: 'dark',
              position: 'top-center',
              transition: Bounce,
            });
            console.error(err);
          },
        });
      }
    });
  };

  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <Head title="ঋণ আপডেট" />

      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Navigation */}
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

          <div className="card bg-base-100 shadow-xl border-t-4 border-primary">
            <div>
              {/* / show total_main_paid, total_interest_paid and total_paid */}
              <div className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">মোট পরিশোধিত আসল</p>
                  <p className="font-bold text-lg text-neutral">
                    {(total_main_paid / 100).toFixed(2)} টাকা
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">মোট পরিশোধিত সুদ</p>
                  <p className="font-bold text-lg text-neutral">
                    {(total_interest_paid / 100).toFixed(2)} টাকা
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">মোট পরিশোধিত</p>
                  <p className="font-bold text-lg text-neutral">
                    {(total_paid / 100).toFixed(2)} টাকা
                  </p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <h2 className="card-title text-xl text-neutral mb-6 flex items-center gap-2 border-b pb-4">
                <Edit size={20} className="text-primary" /> ঋণ তথ্য আপডেট (Loan
                Correction)
              </h2>

              {/* Member Info Context */}
              <div className="bg-primary/5 p-4 rounded-lg mb-6 border border-primary/10 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    সদস্য
                  </p>
                  <p className="font-bold text-lg text-neutral">
                    {member?.name}
                  </p>
                  <p className="text-sm text-gray-600 font-mono">
                    ID: {member?.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    বর্তমান লোন আইডি
                  </p>
                  <p className="font-bold text-neutral">#{loan?.id}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Field (Top Priority for Data Entry) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-black flex items-center gap-2">
                      <Calendar size={16} /> শেষ জমার তারিখ (last_paying_date){' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <span className="block">
                    {dateFormatter(loan?.last_paying_date)}
                  </span>
                  <input
                    type="date"
                    required
                    className={`input input-bordered ${errors.last_paying_date ? 'input-error' : ''}`}
                    value={data.last_paying_date}
                    onChange={(e) =>
                      setData('last_paying_date', e.target.value)
                    }
                  />
                  {errors.last_paying_date && (
                    <p className="text-error text-xs mt-1">
                      {errors.last_paying_date}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Loan */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        মোট ঋণ (total_loan)
                      </span>
                    </label>
                    <input
                      type="number"
                      required
                      className={`input input-bordered ${errors.total_loan ? 'input-error' : ''}`}
                      value={data.total_loan}
                      onChange={(e) => setData('total_loan', e.target.value)}
                    />
                    {errors.total_loan && (
                      <p className="text-error text-xs mt-1">
                        {errors.total_loan}
                      </p>
                    )}
                  </div>

                  {/* Total Paid */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        মোট পরিশোধ (total_paid)
                      </span>
                    </label>
                    <input
                      type="number"
                      required
                      className={`input input-bordered ${errors.total_paid ? 'input-error' : ''}`}
                      value={data.total_paid}
                      onChange={(e) => setData('total_paid', e.target.value)}
                    />
                    {errors.total_paid && (
                      <p className="text-error text-xs mt-1">
                        {errors.total_paid}
                      </p>
                    )}
                  </div>

                  {/* Daily Payable Main */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-gray-600">
                        দৈনিক আসল পরিশোধযোগ্য (daily_payable_main)
                      </span>
                    </label>
                    <input
                      required
                      type="number"
                      className="input input-bordered"
                      value={data.daily_payable_main}
                      onChange={(e) =>
                        setData('daily_payable_main', e.target.value)
                      }
                    />
                  </div>

                  {/* Daily Payable Interest */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-gray-600">
                        দৈনিক সুদ পরিশোধযোগ্য (daily_payable_interest)
                      </span>
                    </label>
                    <input
                      type="number"
                      required
                      className="input input-bordered"
                      value={data.daily_payable_interest}
                      onChange={(e) =>
                        setData('daily_payable_interest', e.target.value)
                      }
                    />
                  </div>

                  {/* Remaining Payable Main */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-warning-content">
                        মোট বাকি পরিশোধযোগ্য আসল(remaining_payable_main)
                      </span>
                    </label>
                    <input
                      type="number"
                      required
                      className="input input-bordered border-warning"
                      value={data.remaining_payable_main}
                      onChange={(e) =>
                        setData('remaining_payable_main', e.target.value)
                      }
                    />
                  </div>

                  {/* Remaining Payable Interest */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-warning-content">
                        মোট বাকি পরিশোধযোগ্য সুদ (remaining_payable_interest)
                      </span>
                    </label>
                    <input
                      type="number"
                      required
                      className="input input-bordered border-warning"
                      value={data.remaining_payable_interest}
                      onChange={(e) =>
                        setData('remaining_payable_interest', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-primary w-full btn-lg text-white"
                  >
                    {processing ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'আপডেট সম্পন্ন করুন'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default DEUpdateLoan;
