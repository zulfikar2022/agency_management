import dayjs from 'dayjs';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function DepositCollections({ deposit_collections, member }) {
  console.log(deposit_collections);
  return (
    <LayoutForMoney>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="pl-10 mt-4">
          <Link
            href={route('admin.bank.member_details', {
              member: member?.id,
            })}
            className="text-blue-700 underline "
          >
            {' '}
            <span className="flex">
              <ArrowLeft /> <span>ফিরে যান</span>
            </span>{' '}
          </Link>
        </div>{' '}
        <h1 className="font-bold text-2xl text-center">সঞ্চয়ের তালিকা</h1>
        {/* show some member details from the member object */}
        <div className="text-center mb-6">
          <p className="font-bold">
            সদস্যঃ{' '}
            <span className="font-normal text-lg">{member?.name}</span>{' '}
          </p>
          <p className="font-bold">
            সদস্য আইডিঃ{' '}
            <span className="font-normal text-lg">{member?.id}</span>{' '}
          </p>
        </div>
        {deposit_collections.length === 0 ? (
          <p className="text-center mt-4">কোনো সঞ্চয় পাওয়া যায়নি।</p>
        ) : (
          <div className="max-w-2xl mx-auto mt-6">
            {deposit_collections.map((collection) => (
              <div className="border-b ">
                <div
                  key={collection.id}
                  className="p-4 grid grid-cols-1 md:grid-cols-2 justify-center gap-4"
                >
                  <p className="font-bold">
                    তারিখঃ <br />
                    <span className="font-normal">
                      {dayjs(collection.created_at).format('D MMMM YYYY')}
                    </span>
                    <br />
                    {collection.updates.length > 0 && (
                      <span className="text-sm text-slate-400">
                        (আপডেট করা হয়েছে)
                      </span>
                    )}
                  </p>
                  <p className="font-bold">
                    পরিমাণঃ <br />
                    <span className="font-normal">
                      {collection.deposit_amount / 100} টাকা
                    </span>
                  </p>
                </div>
                {collection.updates.length === 0 ? null : (
                  <div className="mt-2 ml-4">
                    <p className="text-center italic underline">
                      আপডেটের বিবরণঃ
                    </p>
                    {collection.updates.map((update) => {
                      console.log(update);
                      return (
                        <div
                          key={update.id}
                          className=" mb-2 pb-1 grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <p className="font-bold">
                            আপডেটের আগের পরিমাণঃ <br />
                            <span className="font-normal">
                              {update.deposit_amount_before_update / 100} টাকা
                            </span>
                          </p>
                          <p className="font-bold">
                            আপডেটের পরের পরিমাণঃ <br />
                            <span className="font-normal">
                              {update.deposit_amount_after_update / 100} টাকা
                            </span>
                          </p>
                          <p className="font-bold">
                            আপডেট করেছেনঃ <br />
                            <span className="font-normal">
                              {update.updating_user_name}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutForMoney>
  );
}

export default DepositCollections;
