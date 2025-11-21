import { Link } from '@inertiajs/react';
import { useState } from 'react';

function EmployeeTodaysCollectionResponsiveTable({ collections }) {
  const [todaysCollection, setTodaysCollection] = useState(collections);
  return (
    <div>
      {todaysCollection?.length === 0 && (
        <p className="text-center text-slate-500">কোন কালেকশন পাওয়া যায় নি</p>
      )}

      <div className="container mx-auto space-y-4 ">
        {todaysCollection?.map((collection) => {
          return (
            <div
              key={collection.customer.id}
              className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 border-b pb-2 px-4 md:px-1 ${
                collection?.totalWeeklyCollectableAmount -
                  collection?.totalWeeklyCollectedAmount >
                0
                  ? 'bg-red-100'
                  : ''
              }`}
            >
              <div>
                <p className="font-bold">কাস্টমারের নামঃ</p>
                <Link
                  className="text-blue-600 underline"
                  href={route('employee.customerDetails', {
                    id: collection?.customer?.id,
                  })}
                >
                  {collection?.customer?.name}
                </Link>
                <br />
                <span className="text-xs text-slate-500">
                  {collection?.is_updated ? ' (আপডেটেড)' : ''}
                </span>
              </div>
              <div>
                <p className="font-bold">ঠিকানা</p>
                <p>{collection?.customer?.address}</p>
              </div>

              <div>
                <p className="font-bold">সাপ্তাহিক পরিশোধযোগ্যঃ</p>
                <p>{collection?.totalWeeklyCollectableAmount}</p>
              </div>
              <div>
                <p className="font-bold">সাপ্তাহিক কালেকশনঃ</p>
                <p>{collection?.totalWeeklyCollectedAmount}</p>
              </div>
              <div>
                <p className="font-bold">আজকের বাকিঃ </p>
                <p>
                  {collection?.totalWeeklyCollectableAmount -
                    collection?.totalWeeklyCollectedAmount >
                  0
                    ? collection?.totalWeeklyCollectableAmount -
                      collection?.totalWeeklyCollectedAmount
                    : 0}
                </p>
              </div>

              <div>
                <p className="font-bold">মোট বাকিঃ </p>
                <p>{collection?.totalRemainingPayableAmount}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmployeeTodaysCollectionResponsiveTable;
