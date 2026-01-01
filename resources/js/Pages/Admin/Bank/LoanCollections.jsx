import dayjs from 'dayjs';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function LoanCollections({ member, loan_collections }) {
  console.log(loan_collections, member);
  return (
    <LayoutForMoney>
      <Head title="ঋণের কিস্তির তালিকা" />
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
        </div>
        <h1 className="font-bold text-2xl text-center">ঋণের কিস্তির তালিকা</h1>
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
          <a
            href={route(
              'admin.bank.generate_member_loan_collection_report',
              member.id
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-xs btn-neutral md:mb-0"
          >
            ঋণের কিস্তি কালেকশনের রিপোর্ট তৈরি করুন
          </a>
        </div>
        {loan_collections.length === 0 ? (
          <p className="text-center mt-4">কোনো ঋণের সংগ্রহ পাওয়া যায়নি।</p>
        ) : (
          <div className="max-w-2xl mx-auto mt-6">
            {loan_collections.map((collection) => (
              <div key={collection?.id} className="border-b pb-1 px-2 ">
                <div
                  key={collection.id}
                  className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4"
                >
                  <p className="font-bold">
                    তারিখঃ <br />
                    <span className="font-normal">
                      {dayjs(collection.created_at).format('D MMMM YYYY')}
                    </span>
                    <br />
                    {collection?.updates?.length > 0 && (
                      <span className="text-sm text-slate-400">
                        (আপডেট করা হয়েছে)
                      </span>
                    )}
                  </p>
                  <p className="font-bold">
                    পরিমাণঃ <br />
                    <span className="font-normal">
                      {(collection.paid_amount / 100).toFixed(2)} টাকা
                    </span>
                  </p>
                </div>
                {collection?.updates?.length === 0 ? null : (
                  <div className="mt-2 ml-4">
                    <p className="text-center italic underline">
                      আপডেটের বিবরণঃ
                    </p>
                    {collection.updates.map((update) => (
                      <div
                        key={update.id}
                        className="mb-1 grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div className="font-bold">
                          <p>আপডেটের আগের পরিমাণঃ </p>{' '}
                          <span className="font-normal">
                            {(update?.paid_amount_before_update / 100).toFixed(
                              2
                            )}{' '}
                            টাকা
                          </span>
                        </div>
                        <div className="font-bold">
                          <p>আপডেটের পরের পরিমাণঃ </p>{' '}
                          <span className="font-normal">
                            {(update?.paid_amount_after_update / 100).toFixed(
                              2
                            )}{' '}
                            টাকা
                          </span>
                        </div>
                        <div className="font-bold">
                          <p>আপডেট করেছেনঃ </p>{' '}
                          <span className="font-normal">
                            {update?.updating_user_name}
                          </span>
                        </div>
                      </div>
                    ))}
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

export default LoanCollections;
