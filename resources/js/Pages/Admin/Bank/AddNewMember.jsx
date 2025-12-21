import { useForm } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';

function AddNewMember() {
  const { data, setData, post, processing, errors } = useForm({
    name: 'fake name',
    address: 'fake address',
    phone_number: '0123456789',
    nid_number: '1234567',
    fathers_name: 'fake fathers name',
    mothers_name: 'fake mothers name',
    admission_fee: 20,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', data);
    console.log('second line');
    Swal.fire({
      text: 'আপনি কি আসলেই নতুন সদস্য যুক্ত করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, চাই!',
    }).then((result) => {
      if (result.isConfirmed) {
        post(route('admin.bank.storeCustomer'), {
          preserveScroll: true,
          onSuccess: () => {
            // reset();
            toast.success('সদস্য সফলভাবে যুক্ত করা হয়েছে!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
              transition: Bounce,
            });
          },
          onError: () => {
            toast.error('সদস্য যুক্ত করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', {
              position: 'top-center',
              autoClose: 3000,
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
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Title & Description */}
              <h2 className="card-title text-2xl mb-2">
                নতুন সদস্য তৈরি করুন
              </h2>{' '}
              {/* Create Member */}
              <p className="text-sm text-base-content/70 mb-6">
                <span className="text-error">*</span> অবশ্য পূরণীয় ক্ষেত্রসমূহ।
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name (Required) */}
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
                    placeholder="আব্দুল করিম"
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.name}
                      </span>
                    </label>
                  )}
                </div>

                {/* Address (Required) */}
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
                    placeholder="সদর, ঠাকুরগাঁও"
                  />
                  {errors.address && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.address}
                      </span>
                    </label>
                  )}
                </div>

                {/* Phone Number (Required) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      ফোন নম্বর <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.phone_number ? 'input-error' : ''}`}
                    value={data.phone_number}
                    required
                    onChange={(e) => setData('phone_number', e.target.value)}
                    placeholder="0123456789"
                  />
                  {errors.phone_number && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.phone_number}
                      </span>
                    </label>
                  )}
                </div>

                {/* Admission Fee (Fixed) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      ভর্তি ফি <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200" // Styled as non-updatable
                    value={data.admission_fee}
                    readOnly // Prevents user input
                    placeholder="20"
                  />
                  {errors.admission_fee && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.admission_fee}
                      </span>
                    </label>
                  )}
                </div>

                {/* NID Number (Optional) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      জাতীয় পরিচয়পত্র নম্বর / জন্মনিবন্ধন নম্বার{' '}
                      <span className="text-error">*</span>
                      {/* <span className="text-xs text-base-content/60">
                        (Optional)
                      </span> */}
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    required={true}
                    value={data.nid_number}
                    onChange={(e) => setData('nid_number', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>

                {/* Father's Name (Optional) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      পিতার নাম <span className="text-error">*</span>
                      {/* <span className="text-xs text-base-content/60">
                        (Optional)
                      </span> */}
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.fathers_name}
                    required={true}
                    onChange={(e) => setData('fathers_name', e.target.value)}
                    placeholder="আব্দুল মালেক"
                  />
                </div>

                {/* Mother's Name (Optional) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      মাতার নাম <span className="text-error">*</span>
                      {/* <span className="text-xs text-base-content/60">
                        (Optional)
                      </span> */}
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.mothers_name}
                    required={true}
                    onChange={(e) => setData('mothers_name', e.target.value)}
                    placeholder="আয়েশা বেগম"
                  />
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
                        Submitting...
                      </>
                    ) : (
                      'মেম্বার তৈরি করুন' // Create Member
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

export default AddNewMember;
