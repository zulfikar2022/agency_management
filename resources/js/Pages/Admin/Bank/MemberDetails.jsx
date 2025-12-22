import { Link } from '@inertiajs/react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import dayjs from 'dayjs';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import DepositUpdateModal from './DepositUpdateModal';

// admin.bank.generate_member_details_report
function MemberDetails({
  member,
  has_deposit_account,
  has_loan,
  deposit_account,
  total_deposited_amount,
  number_of_deposit_collections,
  days_difference_of_deposit,
  withdraws,
  update_history,
  loan,
}) {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  // today as the format 'YYYY-MM-DD'

  const today = dayjs().format('YYYY-MM-DD');
  const deposit_account_created_date = dayjs(
    deposit_account?.created_at
  ).format('YYYY-MM-DD');
  const loan_account_created_date = dayjs(loan?.created_at).format(
    'YYYY-MM-DD'
  );

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
    phone_number,
  } = member;
  return (
    <LayoutForMoney>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-6 border-b pb-2">
                <div>
                  <h2 className="card-title text-2xl mb-1">{name}</h2>
                  <p className="text-sm text-base-content/60">
                    মেম্বার আইডিঃ{' '}
                    <span className="font-bold text-2xl text-black">{id}</span>
                  </p>
                  <a
                    // href={route('admin.bank.generate_member_details_report', {
                    //   member: id,
                    // })}
                    // className="btn btn-xs btn-outline my-2"
                    href={route(
                      'admin.bank.generate_member_details_report',
                      member.id
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-outline md:mb-0"
                  >
                    সদস্য রিপোর্ট তৈরি করুন
                  </a>
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
                  <Link
                    href={route('admin.bank.deposit_collections', {
                      deposit: deposit_account?.id,
                    })}
                    className="btn btn-xs btn-primary"
                  >
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
                  <Link
                    href={route('admin.bank.loan_installment_collections', {
                      loan: loan?.id,
                    })}
                    className="btn btn-xs btn-error"
                  >
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

                  <Link
                    href={route('admin.bank.withdraw_lists', {
                      deposit: deposit_account?.id,
                    })}
                    className="btn btn-xs btn-info"
                  >
                    উত্তোলনের বিস্তারিত দেখুন
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {has_deposit_account && (
                  <div>
                    <p className="text-center text-xl underline mb-2">
                      সঞ্চয়ী একাউন্টের বিস্তারিত
                    </p>
                    <div className="flex">
                      <p className="font-bold">
                        একাউন্ট তৈরির তারিখঃ{' '}
                        <span className="text-slate-500">
                          {dayjs(deposit_account?.created_at).format(
                            'D MMMM YYYY'
                          )}
                        </span>{' '}
                      </p>{' '}
                      {today === deposit_account_created_date && (
                        <PencilIcon
                          onClick={onOpenModal}
                          className="text-blue-500 hover:cursor-pointer"
                        />
                      )}
                      <DepositUpdateModal
                        open={open}
                        onCloseModal={onCloseModal}
                        deposit={deposit_account}
                      />
                    </div>
                    <p className="font-bold">
                      দৈনিক সঞ্চয়ী পরিমাণঃ{' '}
                      <span className="text-slate-500">
                        {deposit_account?.daily_deposit_amount / 100} টাকা
                      </span>
                    </p>
                    <p className="font-bold border-b border-dashed mb-2">
                      সঞ্চয়ের শেষ তারিখঃ
                      <span className="text-slate-500">
                        {' '}
                        {dayjs(
                          deposit_account?.last_depositing_predictable_date
                        ).format('D MMMM YYYY')}
                      </span>
                    </p>

                    <p className="font-bold">
                      মোট সঞ্চয়ঃ{' '}
                      <span className="text-slate-500">
                        {total_deposited_amount / 100}
                        &nbsp;টাকা
                      </span>{' '}
                    </p>
                    <p className="font-bold border-b border-dashed mb-2">
                      মোট উত্তোলনঃ{' '}
                      <span className="text-slate-500">
                        {(total_deposited_amount - total_deposit) / 100}
                        &nbsp;টাকা
                      </span>{' '}
                    </p>
                    <p className="font-bold ">
                      সঞ্চিত আছেঃ{' '}
                      <span className="text-slate-500">
                        {total_deposit / 100}
                        &nbsp;টাকা
                      </span>{' '}
                    </p>
                  </div>
                )}
                {has_loan && (
                  <div>
                    <h1 className="text-center text-xl underline mb-2">
                      ঋণের বিস্তারিত
                    </h1>

                    <div className="flex ">
                      <p className="font-bold">
                        ঋণ গ্রহণের তারিখঃ{' '}
                        <span className="text-slate-500">
                          {dayjs(loan.created_at).format('D MMMM YYYY')}
                        </span>
                      </p>

                      {today === loan_account_created_date && (
                        <Link
                          href={route('admin.bank.edit_loan', {
                            loan: loan.id,
                          })}
                          className="ml-2"
                        >
                          <PencilIcon className="text-blue-600 hover:cursor-pointer" />
                        </Link>
                      )}
                    </div>
                    <p className="font-bold">
                      ঋণের পরিমাণঃ{' '}
                      <span className="text-slate-500">
                        {loan.total_loan / 100} টাকা
                      </span>
                    </p>
                    <p className="font-bold">
                      মোট পরিশোধযোগ্যঃ{' '}
                      <span className="text-slate-500">
                        {loan.total_payable_amount / 100} টাকা
                      </span>
                    </p>
                    <p className="font-bold">
                      জামানতঃ{' '}
                      <span className="text-slate-500">
                        {loan.safety_money / 100} টাকা
                      </span>
                    </p>
                    <p className="font-bold">
                      দৈনিক পরিশোধযোগ্যঃ{' '}
                      <span className="text-slate-500">
                        {loan.daily_payable_amount / 100} টাকা
                      </span>
                    </p>
                    <p className="font-bold border-b border-dashed mb-2">
                      পরিশোধের শেষ তারিখঃ{' '}
                      <span className="text-slate-500">
                        {dayjs(loan.last_paying_date).format('D MMMM YYYY')}
                      </span>
                    </p>
                    <p className="font-bold  mb-2">
                      পরিশোধ হয়েছেঃ{' '}
                      <span className="text-slate-500">
                        {(loan.total_payable_amount -
                          loan.remaining_payable_amount) /
                          100}{' '}
                        টাকা
                      </span>
                    </p>
                    <p className="font-bold border-b border-dashed mb-2">
                      বাকি আছেঃ{' '}
                      <span className="text-slate-500">
                        {loan.remaining_payable_amount / 100} টাকা
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
                  {/* <div className="bg-primary/10 p-4 rounded-lg text-center border border-primary/20">
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
                  </div> */}
                </div>

                {/* Information List */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">
                    ব্যক্তিগত তথ্য
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <span className="font-bold mr-1"> নামঃ </span>
                      <span className="">{name || 'N/A'}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">পিতার নামঃ </span>
                      <span className="">{fathers_name || 'N/A'}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">মাতার নামঃ </span>
                      <span className="">{mothers_name || 'N/A'}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">
                        জাতীয় পরিচয়পত্র / জন্মনিবন্ধন নম্বরঃ
                      </span>
                      <span className="">{nid_number || 'N/A'}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">ঠিকানাঃ </span>
                      <span className="">{address}</span>
                    </div>
                    <div className="">
                      <span className="font-bold mr-1">ফোন নাম্বারঃ </span>
                      <span className="">{phone_number}</span>
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

      <div className="container mx-auto py-4 px-4">
        <h1 className="font-bold text-center text-2xl">আপডেট ইতিহাস</h1>
        {update_history.length === 0 && (
          <p className="text-center mt-4">কোনো আপডেট ইতিহাস নেই।</p>
        )}
        {update_history.map((update) => (
          <div key={update.id} className="mb-4 p-4 border rounded-lg">
            <p className="text-center underline">
              <span className="font-bold">আপডেটের তারিখঃ </span>
              {dayjs(update.created_at).format('D MMMM YYYY, h:mm A')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <p>
                <span className="font-bold">আপডেটের আগে পিতার নামঃ </span>
                {update.fathers_name_before_update}
              </p>
              <p>
                <span className="font-bold"> আপডেটের পরে পিতার নামঃ </span>
                {update.fathers_name_after_update}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <p>
                <span className="font-bold">আপডেটের আগে মাতার নামঃ </span>
                {update.mothers_name_before_update}
              </p>
              <p>
                <span className="font-bold">আপডেটের পরে মাতার নামঃ </span>
                {update.mothers_name_after_update}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <p>
                <span className="font-bold">
                  আপডেটের আগে জাতীয় পরিচয়পত্র নম্বরঃ{' '}
                </span>
                {update.nid_number_before_update}
              </p>
              <p>
                <span className="font-bold">
                  আপডেটের পরে জাতীয় পরিচয়পত্র নম্বরঃ{' '}
                </span>
                {update.nid_number_after_update}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <p>
                <span className="font-bold">আপডেটের আগে ফোন নাম্বারঃ </span>
                {update.phone_number_before_update}
              </p>
              <p>
                <span className="font-bold">আপডেটের পরে ফোন নাম্বারঃ </span>
                {update.phone_number_after_update}
              </p>
            </div>
          </div>
        ))}
      </div>
    </LayoutForMoney>
  );
}

export default MemberDetails;
