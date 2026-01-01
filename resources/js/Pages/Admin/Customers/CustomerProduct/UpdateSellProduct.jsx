import { Bounce, toast, ToastContainer } from 'react-toastify';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import GoBack from '../../components/GoBack';

function UpdateSellProduct({ purchase, customer, products }) {
  const { error, success } = usePage().props;
  const { data, setData, put, processing, errors } = useForm({
    customer_id: purchase?.customer_id,
    product_id: purchase?.product_id,
    quantity: purchase?.quantity,
    total_payable_price: purchase?.total_payable_price,
    downpayment: purchase?.downpayment || 0,
    weekly_payable_price: purchase?.weekly_payable_price,
    purchase_id: purchase?.id,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [downpayment, setDownpayment] = useState(0);
  const [weeklyPrice, setWeeklyPrice] = useState(0);

  // Sync state with form data
  useEffect(() => {
    setTotalPrice(parseInt(data.total_payable_price) || 0);
    setDownpayment(parseInt(data.downpayment.toString()) || 0);
    setWeeklyPrice(parseInt(data.weekly_payable_price) || 0);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (downpayment > totalPrice) {
      toast.error(error || 'ডাউনপেমেন্ট মোট মূল্যের চেয়ে বেশি হতে পারবে না', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
      return;
    }

    if (weeklyPrice > totalPrice) {
      toast.error(
        error || 'সাপ্তাহিক কিস্তি মোট মূল্যের চেয়ে বেশি হতে পারবে না',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        }
      );
      return;
    }

    put(route('admin.saveUpdatedCustomerProduct', { ...data }), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(success || 'বিক্রয় তথ্য সফলভাবে আপডেট করা হয়েছে।', {
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
      onError: (errors) => {
        toast.error(error || 'কিছু ভুল হয়েছে! আবার চেষ্টা করুন।', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      },
    });
  };
  return (
    <LayoutForProduct>
      <Head title={`বিক্রয় তথ্য আপডেট করুন: ${customer?.name}`} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
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
      {/* <GoBack
        targetRouteName="admin.showCustomerDetails"
        params={{ id: customer.id }}
        text="কাস্টমার বিস্তারিত পেজে ফিরে যান"
      /> */}

      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="text-lg mb-1">
                <span className="font-bold">{customer.name}</span> (
                {customer.address}) এর বিক্রয় তথ্য সম্পাদনা করুন
              </p>
              <p>পরিশোধ করতে বাকি আছেঃ {purchase.remaining_payable_price}</p>
              <p className="text-sm text-base-content/70 mb-6">
                <span className="text-error">*</span> অবশ্যই পূরণ করতে হবে
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Hidden fields */}
                <input type="hidden" value={data.user_id} />
                <input type="hidden" value={data.customer_id} />

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
                        {product.name} - {product.supplier_name}
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
                    onChange={(e) =>
                      setData('weekly_payable_price', e.target.value)
                    }
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

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-neutral w-full"
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default UpdateSellProduct;
