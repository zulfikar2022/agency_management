import { Link } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import dayjs from 'dayjs';

function MemberDetails({
  member,
  has_deposit_account,
  has_loan,
  deposit_account,
  total_deposited_amount,
  number_of_deposit_collections,
  days_difference_of_deposit,
  withdraws,
}) {
  console.log({ deposit_account });
  const {
    name,
    address,
    admission_fee,
    fathers_name,
    mothers_name,
    nid_number,
    total_deposit,
    total_loan,
    id,
  } = member;
  return (
    <LayoutForMoney>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-6 border-b">
                <div>
                  <h2 className="card-title text-2xl mb-1">{name}</h2>
                  <p className="text-sm text-base-content/60">
                    মেম্বার আইডি:{' '}
                    <span className="font-bold text-2xl text-black">{id}</span>
                  </p>
                </div>
                {/* <div className="badge badge-neutral p-3">সক্রিয়</div> */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 border-b pb-2">
                {!has_deposit_account ? (
                  <Link
                    href={route('admin.bank.deposit_account', id)}
                    className="btn btn-xs btn-primary"
                  >
                    সঞ্চয়ী সদস্য হিসেবে অন্তর্ভুক্ত করুন
                  </Link>
                ) : (
                  <Link className="btn btn-xs btn-primary">
                    সঞ্চয়ের বিস্তারিত দেখুন
                  </Link>
                )}
                {!has_loan ? (
                  <Link
                    href={route('admin.bank.provide_loan', {
                      member: id,
                    })}
                    className="btn btn-xs btn-error"
                  >
                    ঋণ প্রদান করুন
                  </Link>
                ) : (
                  <Link className="btn btn-xs btn-error">
                    ঋণের কিস্তির বিস্তারিত দেখুন
                  </Link>
                )}
              </div>
              {has_deposit_account && member?.total_deposit > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 border-b pb-2">
                  <Link
                    href={route('admin.bank.withdraw_money', {
                      member: id,
                    })}
                    className="btn btn-xs btn-warning"
                  >
                    টাকা উত্তোলন করুন
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {has_deposit_account && (
                  <div>
                    <p className="text-center text-xl underline mb-2">
                      সঞ্চয়ী একাউন্টের বিস্তারিত
                    </p>
                    <p className="font-bold">
                      একাউন্ট তৈরির তারিখঃ{' '}
                      <span className="text-slate-500">
                        {dayjs(deposit_account?.created_at).format(
                          'D MMMM YYYY'
                        )}
                      </span>{' '}
                    </p>
                    <p className="font-bold">
                      দৈনিক সঞ্চয়ী পরিমাণঃ{' '}
                      <span className="text-slate-500">
                        {deposit_account?.daily_deposit_amount / 100} টাকা
                      </span>
                    </p>
                    <p className="font-bold">
                      সঞ্চয়ের শেষ তারিখঃ
                      <span className="text-slate-500">
                        {' '}
                        {dayjs(
                          deposit_account?.last_depositing_predictable_date
                        ).format('D MMMM YYYY')}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Financial Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div className="bg-base-200 p-4 rounded-lg text-center">
                    <div className="text-xs text-base-content/60 mb-1">
                      ভর্তি ফি
                    </div>
                    <div className="font-bold text-lg">{admission_fee}</div>
                  </div> */}
                  <div className="bg-primary/10 p-4 rounded-lg text-center border border-primary/20">
                    <div className="text-xs text-primary mb-1">মোট সঞ্চয়</div>
                    <div className="font-bold text-lg text-primary">
                      {total_deposit / 100}
                    </div>
                  </div>
                  <div className="bg-error/10 p-4 rounded-lg text-center border border-error/20">
                    <div className="text-xs text-error mb-1">মোট ঋণ</div>
                    <div className="font-bold text-lg text-error">
                      {total_loan / 100}
                    </div>
                  </div>
                </div>

                {/* Information List */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">
                    বিস্তারিত তথ্য
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <span className="font-bold mr-1">পিতার নাম:</span>
                      <span className="">{fathers_name || 'N/A'}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">মাতার নাম:</span>
                      <span className="">{mothers_name || 'N/A'}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">
                        জাতীয় পরিচয়পত্র নম্বর:
                      </span>
                      <span className="">{nid_number || 'N/A'}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">ঠিকানা:</span>
                      <span className="">{address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions justify-end mt-8 pt-4 border-t">
                <Link
                  href={route('admin.bank.members')}
                  className="btn btn-outline btn-xs w-full md:w-fit"
                >
                  সকল সদস্য দেখুন
                </Link>
                <Link
                  href={route('admin.bank.edit_member', id)}
                  className="btn btn-neutral btn-xs px-8 w-full md:w-fit"
                >
                  আপডেট করুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutForMoney>
  );
}

export default MemberDetails;
