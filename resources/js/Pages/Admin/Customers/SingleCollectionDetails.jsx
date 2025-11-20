import dayjs from 'dayjs';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { WEEKDAYS } from '@/constants';
import { dateFormatter, timeFormatter } from '@/utilityFuntion';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function SingleCollectionDetails({ collections, collectionsUpdateLogs }) {
  //   console.log({ collections, collectionsUpdateLogs });
  console.log(collections);
  return (
    <LayoutForProduct>
      <Link
        className="text-blue-500 hover:underline ml-0 md:ml-10 flex"
        href={route('admin.showCustomerDetails', {
          id: collections[0]?.customer_id,
        })}
      >
        <ArrowLeft /> <span>ফিরে যান</span>
      </Link>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          কিস্তির বিস্তারিত তথ্য
        </h1>
        <div>
          {collections?.map((collection) => {
            return (
              <div key={collection?.id} className="mb-4 p-4 border rounded">
                <p className="font-bold">
                  পণ্যের নামঃ{' '}
                  <span className="font-normal">
                    {collection?.product?.name}
                  </span>
                </p>
                <p className="font-bold">
                  পরিশোধযোগ্য পরিমাণঃ{' '}
                  <span className="font-normal">
                    {collection?.collectable_amount} টাকা
                  </span>
                </p>
                <p className="font-bold">
                  পরিশোধিত পরিমাণঃ{' '}
                  <span className="font-normal">
                    {collection?.collected_amount} টাকা
                  </span>
                </p>
                <p className="font-bold">
                  পরিশোধের তারিখঃ{' '}
                  <span className="font-normal">
                    {dateFormatter(collection?.created_at)}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
        <h2 className="text-xl font-bold text-center mt-10 mb-5">
          আপডেট হিস্ট্রি
        </h2>

        <div>
          {collectionsUpdateLogs?.length === 0 && (
            <p className="text-center">কোনো আপডেট নেই</p>
          )}

          {collectionsUpdateLogs?.map((log) => {
            return (
              <div key={log?.id} className="mb-4 p-4 border-b">
                <p className="font-bold">
                  আপডেটের তারিখঃ
                  <span className="font-normal">
                    {dateFormatter(log?.created_at)}
                  </span>
                </p>
                <p className="font-bold">
                  আপডেটের সময়ঃ
                  <span className="font-normal">
                    {timeFormatter(log?.created_at)}
                  </span>
                </p>
                <p className="font-bold">
                  আপডেট করেছেনঃ
                  <span className="font-normal">
                    {log?.updating_user?.name}-
                    {log?.updating_user?.is_admin ? 'এডমিন' : ''}
                    {log?.updating_user?.is_employee ? 'এমপ্লয়ি' : ''}
                  </span>
                </p>

                <p className="font-bold">
                  পণ্যের নামঃ
                  <span className="font-normal">{log?.product?.name}</span>
                </p>
                <div className="flex flex-col md:flex-row gap-3 md:gap-10 mt-2">
                  <div>
                    <p className="font-bold">আপডেটের আগে পরিশোধিতঃ</p>
                    <span>{log?.collected_amount_before}</span>
                  </div>
                  <div>
                    <p className="font-bold">আপডেটের পরে পরিশোধিতঃ</p>
                    <span>{log?.collected_amount_after}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default SingleCollectionDetails;
