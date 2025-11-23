import { useState } from 'react';
import AdminTodaysCollectionResponsiveTable from '../../components/AdminTodaysCollectionResponsiveTable';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import dayjs from 'dayjs';
import { Link, router, usePage } from '@inertiajs/react';
import CollectionReport from '../../Reports/CollectionReport';
import { dateFormatter } from '@/utilityFuntion';
import { pdf } from '@react-pdf/renderer';

function TodaysCollection({
  collections,
  totalReceivableAmount,
  total_collected_amount,
}) {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { url } = usePage();

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const formattedDate = dayjs(queryParams.get('todate')).format('D MMMM YYYY');
  const formattedDateForQuery = dayjs(formattedDate, 'D MMMM YYYY').format(
    'YYYY-MM-DD'
  );
  console.log('formattedDateForQuery:', formattedDateForQuery);

  const customersPaidIds = collections.map(
    (collection) => collection.customer.id
  );
  const customerUniqueIds = [];

  collections.forEach((collection) => {
    if (!customerUniqueIds.includes(collection.customer.id)) {
      customerUniqueIds.push(collection.customer.id);
    }
  });

  const showableCollectionData = [];

  customerUniqueIds.forEach((id) => {
    const customerId = id;
    const customerCollections = collections.filter(
      (collection) => collection.customer.id === customerId
    );
    const isUpdated = customerCollections.some(
      (collection) => collection.is_updated
    );

    showableCollectionData.push({
      customer: customerCollections[0].customer,
      product: customerCollections[0].product,
      totalCollectableAmount: customerCollections.reduce(
        (total, collection) => total + collection?.collectable_amount,
        0
      ),
      totalCollectedAmount: customerCollections.reduce(
        (total, collection) => total + collection?.collected_amount,
        0
      ),
      totalRemainingPayableAmount: customerCollections.reduce(
        (total, collection) =>
          total + collection?.customer_product?.remaining_payable_price,
        0
      ),
      totalWeeklyCollectableAmount: customerCollections.reduce(
        (total, collection) =>
          total + collection?.customer_product?.weekly_payable_price,
        0
      ),
      totalWeeklyCollectedAmount: customerCollections.reduce(
        (total, collection) => total + collection?.collected_amount,
        0
      ),
      createdAt: customerCollections[0].created_at,
      is_updated: isUpdated,
    });
  });

  return (
    <LayoutForProduct>
      <p className="font-bold text-center text-2xl my-5">আজকের কালেকশন</p>
      <p className="font-bold text-center">
        আজকের টার্গেটঃ {totalReceivableAmount} টাকা
      </p>
      <p className="font-bold text-center mb-5">
        আজকের মোট কালেকশনঃ {total_collected_amount} টাকা
      </p>

      <div className="flex flex-col md:flex-row items-center justify-between md:mx-20 mb-5">
        <div className=" mb-10 flex flex-col md:flex-row gap-5 items-center ">
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              className="border border-gray-300 rounded-md p-2"
            />
            <Link
              href={route('admin.todaysCollections', {
                todate: date,
              })}
              className="btn btn-neutral ml-5"
            >
              খুঁজুন
            </Link>
          </div>

          {showableCollectionData?.length > 0 && (
            <a
              href={route('admin.downloadTodaysCollectionReport', {
                todate: formattedDateForQuery,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-xs btn-outline mb-3 md:mb-0"
            >
              রিপোর্ট তৈরি করুন
            </a>
          )}
        </div>
        <div>
          <p className="font-bold">
            তারিখঃ <span className="font-normal">{formattedDate}</span>
          </p>
        </div>
      </div>
      <AdminTodaysCollectionResponsiveTable
        date={dayjs(date).format('D MMMM YYYY')}
        collections={showableCollectionData}
      />
    </LayoutForProduct>
  );
}

export default TodaysCollection;
