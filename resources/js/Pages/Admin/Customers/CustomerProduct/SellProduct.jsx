import LayoutForProduct from '../../layouts/LayoutForProduct';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import GoBack from '../../components/GoBack';

function SellProduct({ customer, products, user_id }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    user_id: user_id,
    customer_id: customer.id,
    product_id: '',
    quantity: 1,
    total_payable_price: '',
    downpayment: 0,
    weekly_payable_price: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [downpayment, setDownpayment] = useState(0);
  const [weeklyPrice, setWeeklyPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(parseInt(data.total_payable_price) || 0);
    setDownpayment(parseInt(data.downpayment.toString()) || 0);
    setWeeklyPrice(parseInt(data.weekly_payable_price) || 0);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submit
    if (downpayment > totalPrice) {
      alert('Downpayment cannot exceed total price');
      return;
    }
    if (weeklyPrice > totalPrice) {
      alert('Weekly price cannot exceed total price');
      return;
    }

    console.log('Submitting data:', data);

    post(route('admin.sellProductToCustomer'));
  };

  return (
    <LayoutForProduct>
      <GoBack
        targetRouteName="admin.showCustomers"
        text="কাস্টমার তালিকায় ফিরে যান"
      />
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* <h2 className="card-title text-2xl mb-2">
                নতুন কিস্তি তৈরি করুন
              </h2> */}
              <p className="text-lg mb-1">
                <span className="font-bold">{customer.name}</span> (
                {customer.address}) এর নিকট পণ্য বিক্রি করুন
              </p>
              <p className="text-sm text-base-content/70 mb-6">
                <span className="text-error">*</span> অবশ্যই পূরণ করতে হবে
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Hidden user_id */}
                <input type="hidden" value={data.user_id} />

                {/* Product Dropdown */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      পণ্যের নাম <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.product_id ? 'select-error' : ''
                    }`}
                    value={data.product_id}
                    onChange={(e) => setData('product_id', e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      একটি পণ্য নির্বাচন করুন
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {errors.product_id && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.product_id}
                      </span>
                    </label>
                  )}
                </div>

                {/* Quantity */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      পরিমাণ <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={`input input-bordered w-full ${
                      errors.quantity ? 'input-error' : ''
                    }`}
                    value={data.quantity}
                    onChange={(e) =>
                      setData('quantity', parseInt(e.target.value) || 1)
                    }
                    required
                  />
                  {errors.quantity && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.quantity}
                      </span>
                    </label>
                  )}
                </div>

                {/* Total Payable Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      মোট বিক্রয় মূল্য <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={`input input-bordered w-full ${
                      errors.total_payable_price ? 'input-error' : ''
                    }`}
                    value={data.total_payable_price}
                    onChange={(e) =>
                      setData('total_payable_price', e.target.value)
                    }
                    placeholder="৳15000"
                    required
                  />
                  {errors.total_payable_price && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.total_payable_price}
                      </span>
                    </label>
                  )}
                </div>

                {/* Downpayment */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      ডাউনপেমেন্ট (ডিফল্ট 0)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalPrice}
                    className={`input input-bordered w-full ${
                      downpayment > totalPrice ? 'input-error' : ''
                    }`}
                    value={data.downpayment}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (val <= totalPrice) {
                        setData('downpayment', val);
                      }
                    }}
                    placeholder="৳0"
                  />
                  {downpayment > totalPrice && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        ডাউনপেমেন্ট মোট মূল্যের চেয়ে বেশি হতে পারবে না
                      </span>
                    </label>
                  )}
                </div>

                {/* Weekly Payable Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      সাপ্তাহিক কিস্তি <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalPrice}
                    className={`input input-bordered w-full ${
                      errors.weekly_payable_price || weeklyPrice > totalPrice
                        ? 'input-error'
                        : ''
                    }`}
                    value={data.weekly_payable_price}
                    onChange={(e) => {
                      const val = e.target.value;
                      setData('weekly_payable_price', val);
                    }}
                    placeholder="৳500"
                    required
                  />
                  {(errors.weekly_payable_price ||
                    weeklyPrice > totalPrice) && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.weekly_payable_price ||
                          'সাপ্তাহিক কিস্তি মোট মূল্যের চেয়ে বেশি হতে পারবে না'}
                      </span>
                    </label>
                  )}
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
                        সাবমিট হচ্ছে...
                      </>
                    ) : (
                      'পণ্য বিক্রি করুন'
                    )}
                  </button>
                </div>

                {/* <div className="text-center mt-4">
                  <Link
                    // href={route('installments.index')}
                    className="link link-hover"
                  >
                    কিস্তির তালিকায় ফিরে যান
                  </Link>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default SellProduct;
