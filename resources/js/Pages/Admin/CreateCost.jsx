import { Head, Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from './AdminDashboardLayout';
import { ArrowLeft } from 'lucide-react';

function CreateCost() {
  const { data, setData, post, processing, errors, reset } = useForm({
    amount: '',
    description: '',
  });

  // 2. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form Data:', data);
    // admin.storeCost
    post(route('admin.storeCost'), {
      onSuccess: () => reset(), // Clears form on success
      onError: () => {
        toast.error('খরচ যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', {
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
    });
  };
  return (
    <AdminDashboardLayout>
      <div>
        <Head title="নতুন খরচ যোগ করুন" />
        <div className="pl-10 mt-4">
          <Link href={route('home')} className="text-blue-700 underline ">
            {' '}
            <span className="flex">
              <ArrowLeft /> <span>ফিরে যান</span>
            </span>{' '}
          </Link>
        </div>{' '}
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
          <h2 className="text-2xl font-bold mb-6">খরচের বিবরণ লিখুন</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Field */}
            <div>
              <label className="block font-medium text-gray-700">
                টাকার পরিমাণ
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                placeholder=""
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block font-medium text-gray-700">বিবরণ</label>
              <textarea
                required
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="খরচের উদ্দেশ্য লিখুন..."
                rows="3"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'সেভ হচ্ছে...' : 'খরচ জমা দিন'}
            </button>
          </form>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default CreateCost;
