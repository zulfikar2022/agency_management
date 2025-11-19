import { useState } from 'react';
import AdminTodaysCollectionResponsiveTable from '../../components/AdminTodaysCollectionResponsiveTable';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import dayjs from 'dayjs';
import { Link, router, usePage } from '@inertiajs/react';

function TodaysCollection({
  collections,
  totalReceivableAmount,
  total_collected_amount,
}) {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { url } = usePage();

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const formattedDate = dayjs(queryParams.get('todate')).format('D MMMM YYYY');

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
        <div className=" mb-10 flex ">
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
        <div>
          <p className="font-bold">
            তারিখঃ <span className="font-normal">{formattedDate}</span>
          </p>
        </div>
      </div>
      <AdminTodaysCollectionResponsiveTable
        date={dayjs(date).format('D MMMM YYYY')}
        collections={collections}
      />
    </LayoutForProduct>
  );
}

export default TodaysCollection;
