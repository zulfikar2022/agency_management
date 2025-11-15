import { Bounce, toast, ToastContainer } from 'react-toastify';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import GoBack from '../components/GoBack';

const WEEKDAYS = [
  { value: 'saturday', label: 'শনিবার' },
  { value: 'sunday', label: 'বরিবার ' },
  { value: 'monday', label: 'সোমবার' },
  { value: 'tuesday', label: 'মঙ্গলবার' },
  { value: 'wednesday', label: 'বুধবার' },
  { value: 'thursday', label: 'বৃহস্পতিবার' },
  { value: 'friday', label: 'শুক্রবার' },
];

function CreateCustomer() {
  const { previousUrl } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    address: '',
    phone_number: '',
    collection_day: '',
    nid_number: '',
    fathers_name: '',
    mothers_name: '',
  });

  const [formattedPhone, setFormattedPhone] = useState('');
  const [localError, setLocalError] = useState('');

  // Sync with Inertia form data
  useEffect(() => {
    setFormattedPhone(data.phone_number);
  }, [data.phone_number]);

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // 1. Allow only digits
    value = value.replace(/\D/g, '');

    // 2. Limit to 11 digits
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // 3. Must start with '01'
    if (value && !value.startsWith('01')) {
      if (value.startsWith('1')) {
        value = '0' + value; // auto-fix: 1xxxx → 01xxxx
      } else {
        setLocalError('ফোন নম্বর 01 দিয়ে শুরু হতে হবে');
        setFormattedPhone(value);
        setData('phone_number', '');
        return;
      }
    } else {
      setLocalError('');
    }

    // 4. Final validation: exactly 11 digits
    if (value.length === 11 && value.startsWith('01')) {
      setData('phone_number', value);
      setLocalError('');
    } else {
      setData('phone_number', ''); // invalid → don't send to backend
    }

    setFormattedPhone(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('inside handle submit');
    console.log(data);

    post(route('admin.storeCustomer'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        toast.success('কাস্টমার সফলভাবে যুক্ত করা হয়েছে!', {
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
  };
  return (
    <LayoutForProduct>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2">কাস্টমার তৈরি করুন</h2>
              <p className="text-sm text-base-content/70 mb-6">
                <span className="text-error">*</span> অবশ্য পূরণীয় ক্ষেত্রসমূহ।
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

                {/* Phone Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      ফোন নম্বর <span className="text-error">*</span>
                    </span>
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    className={`input input-bordered w-full ${
                      errors.phone_number || localError ? 'input-error' : ''
                    }`}
                    value={formattedPhone}
                    onChange={handlePhoneChange}
                    placeholder="01xxxxxxxxx"
                    maxLength={11}
                  />

                  {/* Show error: from server OR local validation */}
                  {(errors.phone_number || localError) && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.phone_number || localError}
                      </span>
                    </label>
                  )}
                </div>

                {/* Collection Day */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      টাকা সংগ্রহের দিন <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    required
                    className={`select select-bordered w-full ${errors.collection_day ? 'select-error' : ''}`}
                    value={data.collection_day}
                    onChange={(e) => setData('collection_day', e.target.value)}
                  >
                    <option value="" disabled>
                      একটি দিন নির্বাচন করুন
                    </option>
                    {WEEKDAYS.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                  {errors.collection_day && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.collection_day}
                      </span>
                    </label>
                  )}
                </div>

                {/* NID Number (Optional) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      জাতীয় পরিচয়পত্র নম্বর{' '}
                      <span className="text-xs text-base-content/60">
                        (Optional)
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.nid_number}
                    onChange={(e) => setData('nid_number', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>

                {/* Father's Name (Optional) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      পিতার নাম{' '}
                      <span className="text-xs text-base-content/60">
                        (Optional)
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.fathers_name}
                    onChange={(e) => setData('fathers_name', e.target.value)}
                    placeholder="আব্দুল মালেক"
                  />
                </div>

                {/* Mother's Name (Optional) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      মাতার নাম{' '}
                      <span className="text-xs text-base-content/60">
                        (Optional)
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.mothers_name}
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
                      'Create User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default CreateCustomer;
