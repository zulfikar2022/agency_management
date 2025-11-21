import { WEEKDAYS } from '@/constants';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';

function AdminCollectionList({ collections }) {
  const uniqueDays = [];
  const sameDayCollections = [];

  // get the customers id from the url
  const urlParts = window.location.pathname.split('/');
  const customerId = urlParts[urlParts?.length - 1]; // assuming the URL structure is /admin/customers/{id}/...

  collections?.forEach((collection) => {
    if (uniqueDays.indexOf(collection.collecting_date) === -1) {
      uniqueDays.push(collection.collecting_date);
    }
  });

  for (let i = 0; i < uniqueDays.length; i++) {
    const date = uniqueDays[i];

    const collectionsOfTheDay = collections?.filter(
      (collection) => collection.collecting_date === date
    );

    const sameDayCollectionsIds = collections
      .filter((collection) => collection.collecting_date === date)
      .map((item) => item.id);

    const formattedCreatedAt = dayjs(collectionsOfTheDay[0]?.created_at);

    const day = formattedCreatedAt.date();
    const dateDay = formattedCreatedAt.format('dddd')?.toLowerCase();
    const month = formattedCreatedAt.format('MMMM');
    const year = formattedCreatedAt.year();

    // sameDayCollectionsIds.push(collectionsOfTheDay[0]?.id);

    sameDayCollections.push({
      date: date,
      totalCollected: collectionsOfTheDay.reduce(
        (total, item) => total + item.collected_amount,
        0
      ),
      totalCollectable: collectionsOfTheDay.reduce(
        (total, item) => total + item.collectable_amount,
        0
      ),
      id: sameDayCollectionsIds.join('-'),
      createdAt: `${day} ${month} ${year} (${WEEKDAYS.find((day) => day.value === dateDay)?.label})`,
      isUpdated: collectionsOfTheDay.some((item) => item.isUpdated),
      collectingUser: collectionsOfTheDay[0]?.collectingUser,
    });
  }

  return (
    <div className="my-5 mx-5 md:mx-0">
      {sameDayCollections.length > 0 && (
        <p className="text-2xl text-center font-bold">কিস্তির লিস্ট</p>
      )}
      <div className="container mx-auto mt-5">
        {sameDayCollections?.map((item, index) => {
          return (
            <div
              key={item?.id}
              className={`grid gird-cols-1 md:grid-cols-5 border-b pb-3 mb-3 items-center ${item?.totalCollectable - item?.totalCollected > 0 ? 'bg-red-200' : ''}`}
            >
              <div>
                <p className="font-bold">তারিখঃ </p>
                <p>{item.createdAt}</p>
                <span className="text-sm text-slate-700">
                  {item?.isUpdated ? '(আপডেট হয়েছে)' : ''}
                </span>
                <span>{item?.collectingUser?.name}</span>
              </div>
              <div>
                <p className="font-bold">কালেকশনযোগ্যঃ </p>
                <p>{item?.totalCollectable}</p>
              </div>
              <div>
                <p className="font-bold">কালেকশন হয়েছেঃ </p>
                <p>{item?.totalCollected}</p>
              </div>
              <div>
                <p className="font-bold">বাকি আছেঃ </p>
                <p>
                  {item?.totalCollectable - item?.totalCollected > 0
                    ? item?.totalCollectable - item?.totalCollected
                    : 0}
                </p>
              </div>
              <div>
                <Link
                  href={route('admin.showCustomersCollectionsOnDate', {
                    customer_id: customerId,
                    date: item.date,
                  })}
                  className="btn btn-xs btn-outline"
                >
                  {' '}
                  বিস্তারিত দেখুন{' '}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminCollectionList;
