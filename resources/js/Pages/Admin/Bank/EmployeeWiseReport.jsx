import dayjs from 'dayjs';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { dateFormatter } from '@/utilityFuntion';

function EmployeeWiseReport({
  employee,
  deposit_collections,
  total_deposit_collection,
  loan_collections,
  total_loan_collection,
  start_date,
  end_date,
}) {
  return (
    <LayoutForMoney>
      <Head title="এমপ্লয়ী ভিত্তিক রিপোর্ট" />
      <div className="container mx-auto">
        <Link
          // href={route('admin.bank.member_details', {
          //   member: member?.id,
          // })}
          href={route('admin.bank.employee_wise_collection_report')}
          className="text-blue-700 underline mt-3 block"
        >
          {' '}
          <span className="flex">
            <ArrowLeft /> <span>ফিরে যান</span>
          </span>{' '}
        </Link>
        <p className="text-center font-bold text-2xl my-2">
          এমপ্লয়ী ভিত্তিক রিপোর্ট
        </p>
        <div className="grid grid-cols-1 px-2 md:px-0 md:grid-cols-2 gap-3 justify-items-center border-b-2 pb-4 mb-4">
          <div>
            <p className=" font-semibold">
              এমপ্লয়ীর নাম: <span className="font-normal">{employee.name}</span>
            </p>
            <p className=" font-semibold">
              এমপ্লয়ীর আইডি: <span className="font-normal">{employee.id}</span>
            </p>
            <p className=" font-semibold">
              রিপোর্টের সময়কাল:{' '}
              <span className="font-normal">
                {' '}
                {start_date === end_date
                  ? dateFormatter(start_date)
                  : `${dateFormatter(start_date)} থেকে ${dateFormatter(end_date)}`}
              </span>
            </p>
            <p className="font-bold">
              রিপোর্ট তৈরির তারিখঃ{' '}
              <span className="font-normal">{dateFormatter(dayjs())}</span>
            </p>
          </div>
          <div>
            <p className=" font-bold">
              মোট সঞ্চয়ের কালেকশনঃ{' '}
              <span className="font-normal">
                {(total_deposit_collection / 100).toFixed(2)} টাকা
              </span>
            </p>
            <p className=" font-bold">
              মোট ঋণের কিস্তি কালেকশনঃ{' '}
              <span className="font-normal">
                {(total_loan_collection / 100).toFixed(2)} টাকা
              </span>
            </p>
            <p className=" font-bold">
              মোট কালেকশনঃ{' '}
              <span className="font-normal">
                {(
                  (total_deposit_collection + total_loan_collection) /
                  100
                ).toFixed(2)}{' '}
                টাকা
              </span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-4">
          <div>
            <h2 className="font-bold text-2xl text-center mb-5 mt-3">
              সঞ্চয়ের কালেকশন
            </h2>
            {deposit_collections.map((collection) => (
              <div
                key={collection.id}
                className="border-b-2 mb-2 pb-2 border-slate-500"
              >
                <div className=" pb-2 mb-2 last:border-0 last:pb-0 last:mb-0 grid grid-cols-1 md:grid-cols-4 gap-2">
                  <p className="font-semibold">
                    সদস্যের আইডি:{' '}
                    <span className="font-normal">{collection.member_id}</span>
                    {collection.updates.length > 0 && (
                      <span className="text-sm text-slate-600 font-bold ml-2">
                        (আপডেটেড)
                      </span>
                    )}
                  </p>
                  <p className="font-semibold">
                    গ্রাহক নাম:{' '}
                    <span className="font-normal">
                      {collection.member_name}
                    </span>
                  </p>

                  <p className="font-semibold">
                    কালেকশন তারিখ:{' '}
                    <span className="font-normal">
                      {dayjs(collection?.created_at).format('DD MMMM YYYY')}
                    </span>
                  </p>
                  <p className="font-semibold">
                    কালেকশন পরিমাণ:{' '}
                    <span className="font-normal">
                      {(collection.deposit_amount / 100).toFixed(2)} টাকা
                    </span>
                  </p>
                </div>
                {collection.updates.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold text-slate-600 text-center underline">
                      আপডেটসমূহ:
                    </h3>
                    {collection.updates.map((update, index) => (
                      <div
                        key={index}
                        className="ml-4 grid grid-cols-1 md:grid-cols-2 gap-2 mb-2"
                      >
                        <p className="font-semibold">
                          আপডেট আগের পরিমাণ:{' '}
                          <span className="font-normal">
                            {(
                              update?.deposit_amount_before_update / 100
                            ).toFixed(2)}{' '}
                            টাকা
                          </span>
                        </p>
                        <p className="font-semibold">
                          আপডেট পরের পরিমাণ:{' '}
                          <span className="font-normal">
                            {(
                              update?.deposit_amount_after_update / 100
                            ).toFixed(2)}{' '}
                            টাকা
                          </span>
                        </p>
                        {/* <p className="font-semibold">
                          আপডেট করেছেন:{' '}
                          <span className="font-normal">
                            {update?.updating_user_name}(
                            <span className="font-bold">
                              {update?.updating_user_id}
                            </span>
                            )
                          </span>
                        </p> */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <h2 className="font-bold text-2xl text-center mb-5 mt-3">
              ঋণের কালেকশন
            </h2>
            {loan_collections.map((collection) => (
              <div
                key={collection.id}
                className="border-b-2 mb-2 pb-2 border-slate-500"
              >
                <div className=" pb-2 mb-2 last:border-0 last:pb-0 last:mb-0 grid grid-cols-1 md:grid-cols-4 gap-2">
                  <p className="font-semibold">
                    সদস্যের আইডি:{' '}
                    <span className="font-normal">{collection.member_id}</span>
                    {collection.updates.length > 0 && (
                      <span className="text-sm text-slate-600 font-bold ml-2">
                        (আপডেটেড)
                      </span>
                    )}
                  </p>
                  <p className="font-semibold">
                    গ্রাহক নাম:{' '}
                    <span className="font-normal">
                      {collection.member_name}
                    </span>
                  </p>

                  <p className="font-semibold">
                    কিস্তির তারিখ:{' '}
                    <span className="font-normal">
                      {dayjs(collection?.created_at).format('DD MMMM YYYY')}
                    </span>
                  </p>
                  <p className="font-semibold">
                    কিস্তির পরিমাণ:{' '}
                    <span className="font-normal">
                      {(collection.paid_amount / 100).toFixed(2)} টাকা
                    </span>
                  </p>
                </div>
                {collection.updates.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold text-slate-600 text-center underline">
                      আপডেটসমূহ:
                    </h3>
                    {collection.updates.map((update, index) => (
                      <div
                        key={index}
                        className="ml-4 grid grid-cols-1 md:grid-cols-2 justify-items-center gap-2 mb-2"
                      >
                        <p className="font-semibold">
                          আপডেট আগের পরিমাণ:{' '}
                          <span className="font-normal">
                            {(update?.paid_amount_before_update / 100).toFixed(
                              2
                            )}{' '}
                            টাকা
                          </span>
                        </p>
                        <p className="font-semibold">
                          আপডেট পরের পরিমাণ:{' '}
                          <span className="font-normal">
                            {(update?.paid_amount_after_update / 100).toFixed(
                              2
                            )}{' '}
                            টাকা
                          </span>
                        </p>
                        {/* <p className="font-semibold">
                          আপডেট করেছেন:{' '}
                          <span className="font-normal">
                            {update?.updating_user_name}(
                            <span className="font-bold">
                              {update?.updating_user_id}
                            </span>
                            )
                          </span>
                        </p> */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutForMoney>
  );
}

export default EmployeeWiseReport;
