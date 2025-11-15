// resources/js/Pages/Admin/Customers/EditCustomer.tsx
import { Bounce, toast, ToastContainer } from 'react-toastify';

import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { WEEKDAYS } from '@/constants';
import GoBack from '../components/GoBack';

function UpdateCustomer({ customer }) {
  const { previousUrl } = usePage().props;
  const { data, setData, put, processing, errors, reset } = useForm({
    name: customer?.name || '',
    address: customer?.address || '',
    phone_number: customer?.phone_number || '',
    collection_day: customer?.collection_day || '',
    nid_number: customer?.nid_number || '',
    fathers_name: customer?.fathers_name || '',
    mothers_name: customer?.mothers_name || '',
  });

  const [formattedPhone, setFormattedPhone] = useState('');
  const [localError, setLocalError] = useState('');

  // Sync phone input with formatted value
  useEffect(() => {
    setFormattedPhone(data.phone_number);
  }, [data.phone_number]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // only digits

    if (value.length > 11) value = value.slice(0, 11);

    if (value && !value.startsWith('01')) {
      if (value.startsWith('1')) {
        value = '0' + value;
      } else {
        setLocalError('ফোন নম্বর 01 দিয়ে শুরু হতে হবে');
        setFormattedPhone(value);
        setData('phone_number', '');
        return;
      }
    } else {
      setLocalError('');
    }

    if (value.length === 11 && value.startsWith('01')) {
      setData('phone_number', value);
      setLocalError('');
    } else {
      setData('phone_number', '');
    }

    setFormattedPhone(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    put(route('admin.updateCustomer', customer.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('কাস্টমার সফলভাবে আপডেট করা হয়েছে!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
          transition: Bounce,
        });
      },
      onError: () => {
        toast.error('আপডেট করতে সমস্যা হয়েছে।', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'dark',
        });
      },
    });
  };

  return (
    <LayoutForProduct>
      <GoBack
        targetRouteName="admin.showCustomers"
        text="কাস্টমার তালিকায় ফিরে যান"
      />
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
              <h2 className="card-title text-2xl mb-2">কাস্টমার আপডেট করুন</h2>
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
                    className={`select select-bordered w-full ${
                      errors.collection_day ? 'select-error' : ''
                    }`}
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

                {/* NID Number */}
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

                {/* Father's Name */}
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

                {/* Mother's Name */}
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

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-neutral flex-1"
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        আপডেট হচ্ছে...
                      </>
                    ) : (
                      'আপডেট করুন'
                    )}
                  </button>

                  {/* <Link
                    href={route('admin.customers.index')}
                    className="btn btn-ghost flex-1"
                  >
                    বাতিল
                  </Link> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default UpdateCustomer;
