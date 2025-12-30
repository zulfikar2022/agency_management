import { router, useForm } from '@inertiajs/react';
import AdminDashboardLayout from './AdminDashboardLayout';
import { dateFormatter } from '@/utilityFuntion';
import { PencilIcon } from 'lucide-react';

function ShowCosts({ costs, start_date, end_date, user_id }) {
  const { data, setData, get, processing } = useForm({
    start_date: start_date || '',
    end_date: end_date || '',
  });

  const totalCost = costs.reduce(
    (total, cost) => total + parseFloat(cost.amount),
    0
  );
  const handleFilter = (e) => {
    e.preventDefault();
    // This sends a GET request to the current URL with the date parameters
    get(
      route('admin.showCosts', {
        start_date: data.start_date,
        end_date: data.end_date,
      }),
      {
        preserveState: true, // Keeps the scroll position and state
      }
    );
  };

  const handleEdit = (costId) => {
    router.get(route('admin.editCost', costId));
  };

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto my-5 ">
        <h1 className="text-2xl font-bold mb-4 text-center">খরচ সমূহ</h1>
        <p className="text-center font-bold">মোট খরচ: {totalCost} টাকা</p>
        <div className="mb-6">
          <form
            onSubmit={handleFilter}
            className="flex flex-wrap items-end gap-4 px-3 md:px-0"
          >
            <div>
              <label className="block text-sm font-bold text-gray-700">
                শুরুর তারিখ
              </label>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
                className="mt-1 block w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">
                শেষ তারিখ
              </label>
              <input
                type="date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
                className="mt-1 block w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? 'লোড হচ্ছে...' : 'ফিল্টার করুন'}
            </button>
          </form>
        </div>
        <div>
          {costs.length === 0 ? (
            <p className="text-center">
              {start_date === end_date
                ? `${dateFormatter(start_date)} তারিখে কোনো খরচ পাওয়া যায়নি।`
                : `${dateFormatter(start_date)} থেকে ${dateFormatter(end_date)} তারিখের মধ্যে কোনো খরচ পাওয়া যায়নি।`}
            </p>
          ) : (
            costs.map((cost) => {
              console.log(cost);
              return (
                <div
                  className="grid grid-cols-1 md:grid-cols-10 justify-items-start md:justify-items-center gap-4 bg-gray-100 p-2 mb-4 border-b pb-2"
                  key={cost.id}
                >
                  <div className="col-span-3">
                    <p className="font-bold">বিবরণঃ </p>
                    <span>{cost.description}</span>
                  </div>
                  <div className="col-span-2">
                    <p className="font-bold">পরিমাণঃ </p>
                    <span>{cost.amount} টাকা</span>
                  </div>
                  <div className="col-span-2">
                    <p className="font-bold">যিনি খরচ যুক্ত করেছেনঃ </p>
                    <span>{cost.creating_user_name}</span>
                  </div>
                  <div className="col-span-2">
                    <p className="font-bold">খরচের তারিখঃ </p>
                    <span>{dateFormatter(cost.created_at)}</span>
                  </div>
                  <div className="col-span-1">
                    {user_id === cost.creating_user_id &&
                      cost.created_at.split('T')[0] ===
                        new Date().toISOString().split('T')[0] && (
                        <PencilIcon
                          onClick={() => handleEdit(cost.id)}
                          className="w-6 h-6 text-blue-600 hover:text-blue-800 cursor-pointer"
                        />
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default ShowCosts;
