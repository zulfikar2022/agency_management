import { useForm } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';

function UpdateMember({ member }) {
  const { data, setData, patch, processing, errors } = useForm({
    name: member.name || '',
    address: member.address || '',
    nid_number: member.nid_number || '',
    fathers_name: member.fathers_name || '',
    mothers_name: member.mothers_name || '',
    admission_fee: member.admission_fee / 100 || 20, // Remains Read-Only
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      text: 'আপনি কি সদস্যের তথ্য পরিবর্তন করতে চান?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, পরিবর্তন করুন!',
      cancelButtonText: 'না',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(data);
        // Assuming the route name is admin.bank.update_member
        patch(route('admin.bank.update_member', member.id), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('তথ্য সফলভাবে আপডেট করা হয়েছে!', {
              position: 'top-center',
              autoClose: 3000,
              theme: 'dark',
              transition: Bounce,
            });
          },
          onError: () => {
            toast.error('আপডেট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', {
              position: 'top-center',
              autoClose: 3000,
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
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Title & Description */}
              <h2 className="card-title text-2xl mb-2">
                সদস্যের তথ্য পরিবর্তন করুন
              </h2>
              <p className="text-sm text-base-content/70 mb-6">
                <span className="text-error">*</span> তথ্য পরিবর্তন শেষে "আপডেট
                করুন" বাটনে ক্লিক করুন।
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      নাম <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                    value={data.name}
                    required
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.name}
                      </span>
                    </label>
                  )}
                </div>

                {/* Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      ঠিকানা <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`}
                    value={data.address}
                    required
                    onChange={(e) => setData('address', e.target.value)}
                  />
                  {errors.address && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.address}
                      </span>
                    </label>
                  )}
                </div>

                {/* Admission Fee (Read Only) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      ভর্তি ফি (অপরিবর্তনযোগ্য)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                    value={data.admission_fee}
                    readOnly
                  />
                </div>

                {/* NID Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      জাতীয় পরিচয়পত্র নম্বর{' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.nid_number ? 'input-error' : ''}`}
                    required
                    value={data.nid_number}
                    onChange={(e) => setData('nid_number', e.target.value)}
                  />
                  {errors.nid_number && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.nid_number}
                      </span>
                    </label>
                  )}
                </div>

                {/* Father's Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      পিতার নাম <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.fathers_name ? 'input-error' : ''}`}
                    required
                    value={data.fathers_name}
                    onChange={(e) => setData('fathers_name', e.target.value)}
                  />
                  {errors.fathers_name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.fathers_name}
                      </span>
                    </label>
                  )}
                </div>

                {/* Mother's Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      মাতার নাম <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.mothers_name ? 'input-error' : ''}`}
                    required
                    value={data.mothers_name}
                    onChange={(e) => setData('mothers_name', e.target.value)}
                  />
                  {errors.mothers_name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.mothers_name}
                      </span>
                    </label>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn btn-outline btn-xs flex-1"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-neutral btn-xs flex-2"
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        আপডেট হচ্ছে...
                      </>
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

export default UpdateMember;
