import { WEEKDAYS } from '@/constants';
import { Link } from '@inertiajs/react';

function ResponsiveCustomerTable({ data }) {
  if (data.length === 0) {
    return <div className="text-center my-10 text-gray-500">কোন পণ্য নেই</div>;
  }
  return (
    <div>
      {data?.map((customer, index) => {
        return (
          <div
            key={customer.id}
            className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-5 py-2 border-b`}
          >
            <div className="flex flex-col">
              <p className="font-bold">গ্রাহকের নামঃ</p>
              <p>{customer.name}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">ফোন নম্বরঃ</p>
              <p>{customer.phone_number}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">ঠিকানাঃ </p>
              <p>{customer.address}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">টাকা সংগ্রহের দিনঃ </p>
              <p>
                {
                  WEEKDAYS.find((day) => day.value === customer.collection_day)
                    ?.label
                }
              </p>
            </div>

            <div className="flex flex-row gap-2">
              <Link
                href={route('admin.showCustomerDetails', {
                  id: customer.id,
                })}
                className="btn btn-xs btn-outline"
              >
                {' '}
                বিস্তারিত দেখুন{' '}
              </Link>
              <Link
                href={route('admin.sellProductToCustomerPage', {
                  id: customer.id,
                })}
                className="btn btn-xs btn-outline"
              >
                {' '}
                পণ্য বিক্রি করুন{' '}
              </Link>
              <Link
                href={route('admin.editCustomer', {
                  id: customer.id,
                })}
                className="btn btn-xs btn-outline"
              >
                {' '}
                আপডেট করুন
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResponsiveCustomerTable;
