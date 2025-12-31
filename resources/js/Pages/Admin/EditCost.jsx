import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from './AdminDashboardLayout';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

export default function EditCost({ cost }) {
  // 1. Initialize the form with existing cost data
  const { data, setData, put, processing, errors } = useForm({
    cost_id: cost.id || '',
    amount: cost.amount || '',
    description: cost.description || '',
  });

  // 2. Handle the update submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Sending a PUT request to the update route
    Swal.fire({
      text: 'আপনি কি নিশ্চিত যে আপনি এই খরচটি আপডেট করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'oklch(0.14 0 0)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন!',
    }).then((result) => {
      if (result.isConfirmed) {
        put(route('admin.updateCost'), {
          onError: (error) => {
            toast.error(error?.error || 'আপডেট করতে সমস্যা হয়েছে।', {
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
      }
    });
  };

  return (
    <AdminDashboardLayout>
      <Head title="খরচ এডিট করুন" />
      <div className="pl-10 mt-4">
        <Link
          href={route('admin.showCosts')}
          className="text-blue-700 underline "
        >
          {' '}
          <span className="flex">
            <ArrowLeft /> <span>ফিরে যান</span>
          </span>{' '}
        </Link>
      </div>{' '}
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            খরচের তথ্য সংশোধন করুন
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              টাকার পরিমাণ
            </label>
            <input
              type="number"
              step="0.01"
              value={data.amount}
              onChange={(e) => setData('amount', e.target.value)}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              বিবরণ
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows="4"
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}
