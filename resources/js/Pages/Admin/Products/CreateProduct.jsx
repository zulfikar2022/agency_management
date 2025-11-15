import LayoutForProduct from '../layouts/LayoutForProduct';
import { useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import React from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import GoBack from '../components/GoBack';

function CreateProduct() {
  const { previousUrl } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    supplier_name: '',
    quantity: '',
    price_per_product: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.storeProduct'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        toast.success('পণ্যটি সফলভাবে যুক্ত করা হয়েছে!', {
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
      <div className="min-h-screen bg-base-200 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back button (optional) */}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">নতুন পণ্য যুক্ত করুন</h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Product Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      পণ্যের নাম <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                    // placeholder="e.g. Wireless Mouse"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.name}
                      </span>
                    </label>
                  )}
                </div>

                {/* Supplier Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      সরবরাহকারী প্রতিষ্ঠানের নাম{' '}
                      <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.supplier_name ? 'input-error' : ''}`}
                    // placeholder="e.g. TechSupply Co."
                    value={data.supplier_name}
                    onChange={(e) => setData('supplier_name', e.target.value)}
                  />
                  {errors.supplier_name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.supplier_name}
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
                    min="0"
                    step={1}
                    className={`input input-bordered w-full ${errors.quantity ? 'input-error' : ''}`}
                    // placeholder="50"
                    value={data.quantity}
                    // onChange={(e) => setData('quantity', e.target.value)}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow empty string or positive integers
                      if (value === '' || /^\d+$/.test(value)) {
                        setData(
                          'quantity',
                          value === '' ? '' : parseInt(value, 10)
                        );
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent: -, +, e, E, ., decimal point
                      if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
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

                {/* Price Per Product */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      একটি পণ্যের মূল্য <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={`input input-bordered w-full ${errors.price_per_product ? 'input-error' : ''}`}
                    // placeholder="25"
                    value={data.price_per_product}
                    // onChange={(e) =>
                    //   setData('price_per_product', e.target.value)
                    // }

                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow empty string or positive integers
                      if (value === '' || /^\d+$/.test(value)) {
                        setData(
                          'price_per_product',
                          value === '' ? '' : parseInt(value, 10)
                        );
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent: -, +, e, E, ., decimal point
                      if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    required
                  />
                  {errors.price_per_product && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.price_per_product}
                      </span>
                    </label>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="submit"
                    className="btn btn-neutral flex-1"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        পণ্য সেভ করা হচ্ছে...
                      </>
                    ) : (
                      'পণ্য সেভ করুন'
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

export default CreateProduct;
