import dayjs from 'dayjs';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function WithdrawLists({ withdraws, member, deposits }) {
  const today = new Date().toISOString().split('T')[0];
  // admin.bank.generate_member_withdraw_report
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
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-6 border-b">
                <div>
                  <h2 className="card-title text-2xl mb-1">
                    উত্তোলনের তালিকা - {member.name}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    মেম্বার আইডি:{' '}
                    <span className="font-bold text-2xl text-black">
                      {member.id}
                    </span>
                  </p>
                  <a
                    href={route(
                      'admin.bank.generate_member_withdraw_report',
                      member.id
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-neutral mb-2"
                  >
                    উত্তোলনের রিপোর্ট তৈরি করুন
                  </a>
                </div>
              </div>

              <div>
                {withdraws.length === 0 ? (
                  <p className="text-center mt-4">কোনো উত্তোলন পাওয়া যায়নি।</p>
                ) : (
                  <div>
                    {withdraws.map((withdraw) => {
                      const isTodaysWithdraw =
                        today === withdraw?.created_at.split('T')[0];
                      return (
                        <div key={withdraw.id} className="border-b">
                          <div
                            className={`p-2 grid grid-cols-1  ${isTodaysWithdraw && 'md:grid-cols-3'} ${!isTodaysWithdraw && 'md:grid-cols-2'}  gap-4 items-center`}
                          >
                            <p className="font-bold">
                              তারিখঃ <br />
                              <span className="font-normal">
                                {dayjs(withdraw?.created_at).format(
                                  'D MMMM YYYY'
                                )}
                              </span>
                            </p>
                            <p className="font-bold">
                              পরিমাণঃ <br />
                              <span className="font-normal">
                                {withdraw?.withdraw_amount / 100} টাকা
                              </span>
                            </p>
                            {isTodaysWithdraw && (
                              <Link
                                href={route('admin.bank.withdraw_update', {
                                  withdraw: withdraw.id,
                                })}
                                className="btn btn-xs btn-warning"
                              >
                                আপডেট করুন
                              </Link>
                            )}
                          </div>
                          {withdraw.updates.length === 0 ? null : (
                            <div>
                              <div className="mt-2 ml-4">
                                <p className="text-center italic underline">
                                  আপডেটের বিবরণঃ
                                </p>
                                {withdraw.updates.map((update) => {
                                  return (
                                    <div
                                      key={update.id}
                                      className=" mb-2 pb-1 grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                      <p className="font-bold">
                                        আপডেটের আগের পরিমাণঃ <br />
                                        <span className="font-normal">
                                          {update.withdraw_amount_before_update /
                                            100}{' '}
                                          টাকা
                                        </span>
                                      </p>
                                      <p className="font-bold">
                                        আপডেটের পরিমাণ পরিমাণঃ <br />
                                        <span className="font-normal">
                                          {update.withdraw_amount_after_update /
                                            100}{' '}
                                          টাকা
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
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutForMoney>
  );
}

export default WithdrawLists;
