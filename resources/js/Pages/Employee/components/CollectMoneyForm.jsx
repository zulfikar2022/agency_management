// resources/js/Pages/MoneyCollections/CollectMoneyForm.tsx
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CollectMoneyForm({
  customer_id,
  collectable_amount,
  product_name,
}) {
  const { data, setData, post, processing, errors } = useForm({
    customer_id: customer_id,
    collectable_amount: collectable_amount,
    collected_amount: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // post(route('money-collections.store'), {
    //   preserveScroll: true,
    //   onSuccess: () => {
    //     alert('Payment collected successfully!');
    //     setData('collected_amount', ''); // reset visible field
    //   },
    // });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">পেমেন্ট কালেক্ট করুন ({product_name})</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden Fields */}
            <input type="hidden" name="customer_id" value={data.customer_id} />
            <input
              type="hidden"
              name="collectable_amount"
              value={data.collectable_amount}
            />

            {/* Visible Field: Amount */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  পরিমান {collectable_amount} টাকা{' '}
                </span>
              </label>
              <input
                type="number"
                name="collected_amount"
                min="1"
                step={1}
                max={collectable_amount}
                className={`input input-bordered w-full ${
                  errors.collected_amount ? 'input-error' : ''
                }`}
                value={data.collected_amount}
                onChange={(e) => setData('collected_amount', e.target.value)}
                placeholder={`Max: ${collectable_amount}`}
                required
              />
              {errors.collected_amount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.collected_amount}
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="btn btn-neutral w-full"
            >
              {processing ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Collecting...
                </>
              ) : (
                'Collect Payment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
