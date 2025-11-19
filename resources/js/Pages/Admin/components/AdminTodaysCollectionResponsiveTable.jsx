import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useState } from 'react';

function AdminTodaysCollectionResponsiveTable({ collections, date }) {
  const [todaysCollection, setTodaysCollection] = useState(collections);

  return (
    <div>
      {todaysCollection?.length === 0 && (
        <p className="text-center text-slate-500">কোন কালেকশন পাওয়া যায় নি</p>
      )}

      <div className="container mx-auto space-y-4 ">
        {todaysCollection?.map((collection, index) => {
          return (
            <div
              key={collection.id}
              className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 border-b pb-2 px-4 md:px-1 ${
                collection?.collectable_amount - collection?.collected_amount >
                0
                  ? 'bg-red-100'
                  : ''
              }`}
            >
              <div>
                <p className="font-bold">কাস্টমারের নামঃ</p>
                <Link
                  className="text-blue-600 underline"
                  href={route('admin.showCustomerDetails', {
                    id: collection?.customer?.id,
                  })}
                >
                  {collection?.customer?.name}
                </Link>
              </div>
              <div>
                <p className="font-bold">ঠিকানা</p>
                <p>{collection?.customer?.address}</p>
              </div>
              <div>
                <p className="font-bold">পণ্যের নামঃ</p>
                <p>{collection?.product?.name}</p>
              </div>
              <div>
                <p className="font-bold">সাপ্তাহিক পরিশোধযোগ্যঃ</p>
                <p>{collection?.collectable_amount}</p>
              </div>
              <div>
                <p className="font-bold">সাপ্তাহিক কালেকশনঃ</p>
                <p>{collection?.collected_amount}</p>
              </div>
              <div>
                <p className="font-bold">আজকের বাকিঃ </p>
                <p>
                  {collection?.collectable_amount -
                    collection?.collected_amount >
                  0
                    ? collection?.collectable_amount -
                      collection?.collected_amount
                    : 0}
                </p>
              </div>

              <div>
                <p className="font-bold">মোট বাকিঃ </p>
                <p>{collection?.customer_product?.remaining_payable_price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminTodaysCollectionResponsiveTable;
