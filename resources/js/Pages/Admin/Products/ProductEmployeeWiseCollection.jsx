import dayjs from 'dayjs';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { dateFormatter } from '@/utilityFuntion';
import { Head } from '@inertiajs/react';

function ProductEmployeeWiseCollection({
  start_date,
  end_date,
  employee,
  collections,
  total_collectable,
  total_collection,
}) {
  console.log(collections);
  return (
    <LayoutForProduct>
      <Head title="পণ্যের এমপ্লয়ী ভিত্তিক কালেকশন রিপোর্ট" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          পণ্যের এমপ্লয়ী ভিত্তিক কালেকশন রিপোর্ট
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          <div>
            <p className="font-bold">
              এমপ্লয়ীর আইডিঃ <span className="font-normal">{employee.id}</span>
            </p>
            <p className="font-bold">
              এমপ্লয়ীর নামঃ <span className="font-normal">{employee.name}</span>
            </p>
            <p className="font-bold">
              রিপোর্টের তারিখঃ{' '}
              <span className="font-normal">
                {start_date === end_date
                  ? dateFormatter(start_date)
                  : `${dateFormatter(start_date)} থেকে ${dateFormatter(end_date)}`}{' '}
              </span>
            </p>
          </div>
          <div>
            <p className="font-bold">
              মোট সংগ্রহযোগ্য পরিমাণঃ{' '}
              <span className="font-normal">{total_collectable} টাকা</span>
            </p>
            <p className="font-bold">
              মোট সংগ্রহকৃত পরিমাণঃ{' '}
              <span className="font-normal">{total_collection} টাকা</span>
            </p>
            <p className="font-bold">
              রিপোর্ট তৈরির তারিখঃ{' '}
              <span className="font-normal">
                {dayjs().format('DD MMMM YYYY')}
              </span>
            </p>
          </div>
        </div>

        <div>
          {collections && collections.length == 0 && (
            <p className="text-center py-20 bg-base-100 rounded-xl shadow-inner border border-dashed border-base-300">
              কোনো কালেকশন তথ্য পাওয়া যায়নি।
            </p>
          )}
          {collections.map((collection) => {
            return (
              <div key={collection.id} className="border-b border-slate-500">
                <div className="grid grid-cols-1 md:grid-cols-5  py-4 gap-4">
                  <p>
                    <strong>কাস্টমারের আইডিঃ </strong>
                    {collection.customer_id}
                    {collection.updates && collection.updates.length > 0 && (
                      <span className="text-slate-400 block text-xs font-bold">
                        (আপডেট হয়েছে)
                      </span>
                    )}
                  </p>
                  <p>
                    <strong>কাস্টমারের নামঃ </strong>
                    {collection.customer_name}
                  </p>
                  <p>
                    <strong>সাপ্তাহিক পরিশোধযোগ্যঃ </strong>
                    {collection.collectable_amount} টাকা
                  </p>
                  <p>
                    <strong>পরিশোধ করেছেনঃ </strong>
                    {collection.collected_amount} টাকা
                  </p>
                  <p>
                    <strong>পরিশোধের তারিখঃ </strong>
                    {/* {dayjs(collection.payment_date).format('DD MMMM YYYY')}(
                  {dayjs(collection.payment_date).format('dddd')})
                   */}
                    {dateFormatter(collection.payment_date)}
                  </p>
                </div>
                {collection.updates && collection.updates.length > 0 && (
                  <div>
                    <h3 className="italic underline text-center mt-2 mb-1">
                      আপডেট হিস্ট্রি
                    </h3>
                    {collection.updates.map((update) => {
                      return (
                        <div
                          key={update.id}
                          className="grid grid-cols md:grid-cols-2 justify-items-center gap-4 mb-2 bg-slate-200"
                        >
                          <p>
                            <strong>আপডেটের আগে পরিশোধঃ </strong>
                            {update.collected_amount_before} টাকা
                          </p>
                          <p>
                            <strong>আপডেটের পর পরিশোধঃ </strong>
                            {update.collected_amount_after} টাকা
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default ProductEmployeeWiseCollection;
