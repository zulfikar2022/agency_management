import { WEEKDAYS } from '@/constants';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';

function CollectionListTable({ collections }) {
  console.log(collections);
  const uniqueDays = [];
  const sameDayCollections = [];
  // const sameDayCollectionsIds = [];

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
    });
  }

  return (
    <div className="my-10">
      <div>
        <h2 className="text-center text-2xl font-bold">কিস্তির তালিকা</h2>
        <div className={`container mx-auto px-4 `}>
          {sameDayCollections.map((item, index) => {
            return (
              <div
                key={item.date}
                className={`grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 mb-10 border-dashed border-b p-2 ${item?.totalCollectable - item?.totalCollected > 0 ? 'bg-red-200' : ''}`}
              >
                <div className="flex flex-col">
                  <p className="font-bold">কালেকশনের তারিখঃ</p>
                  <p>{item?.createdAt}</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold">সাপ্তাহিক কালেকশনযোগ্যঃ</p>
                  <p>{item?.totalCollectable}</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold">সাপ্তাহিক কালেকশনঃ </p>
                  <p>{item?.totalCollected}</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold">বাকি আছেঃ </p>
                  <p>
                    {item?.totalCollectable - item?.totalCollected > 0
                      ? item?.totalCollectable - item?.totalCollected
                      : 0}
                  </p>
                </div>
                <div className="flex flex-col">
                  <Link
                    href={route('employee.updateCollectionPage', {
                      collection_id: item?.id,
                    })}
                    className="btn btn-xs btn-outline"
                  >
                    আপডেট করুন
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CollectionListTable;
