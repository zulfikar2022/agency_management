import dayjs from 'dayjs';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import DepositCollectionUpdateModal from './DepositCollectionUpdateModal';
import LoanCollectionUpdateModal from './LoanCollectionUpdateModal';

function EmployeeMemberDetails({
  member,
  loan,
  total_deposited_amount,
  deposit_collections,
  loan_collections,
  withdraws,
}) {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [openLoanModal, setOpenLoanModal] = useState(false);
  const onOpenLoanModal = () => setOpenLoanModal(true);
  const onCloseLoanModal = () => setOpenLoanModal(false);

  const todays_collection = deposit_collections.find((collection) => {
    return collection.deposit_date === new Date().toISOString().split('T')[0];
  });
  const todays_loan_collection = loan_collections.find((collection) => {
    return collection.paying_date === new Date().toISOString().split('T')[0];
  });

  const total_withdrawn_amount = withdraws.reduce(
    (total, withdraw) => total + withdraw?.withdraw_amount,
    0
  );

  return (
    <EmployeeBankLayout>
      <div className=" border p-4 mt-4 container mx-auto rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <p className="font-bold">
            সদস্যের আইডিঃ <span className="font-normal">{member.id}</span>
          </p>
          <p className="font-bold">
            সদস্যের নামঃ <span className="font-normal">{member.name}</span>
          </p>
          <p className="font-bold">
            মোট সঞ্চয়ঃ{' '}
            <span className="font-normal">
              {(total_deposited_amount / 100).toFixed(2)} টাকা{' '}
            </span>
          </p>
          <p className="font-bold">
            মোট উত্তোলনঃ{' '}
            <span className="font-normal">
              {(total_withdrawn_amount / 100).toFixed(2)} টাকা
            </span>
          </p>
          <p className="font-bold">
            একাউন্টে অবশিষ্ট আছে{' '}
            <span className="font-normal">
              {(
                (total_deposited_amount - total_withdrawn_amount) /
                100
              ).toFixed(2)}{' '}
              টাকা
            </span>
          </p>
        </div>
        <div>
          <p className="font-bold">
            মোট লোনঃ{' '}
            <span className="font-normal">
              {((loan?.total_loan || 0) / 100).toFixed(2)} টাকা
            </span>
          </p>
          {/* <p className="font-bold">
            মোট পরিশোধযোগ্যঃ{' '}
            <span className="font-normal">
              {((loan?.total_payable_amount || 0) / 100).toFixed(2)} টাকা
            </span>
          </p> */}
          <p className="font-bold">
            মোট পরিশোধিতঃ{' '}
            <span className="font-normal">
              {(loan?.total_paid / 100).toFixed(2)} টাকা
            </span>
          </p>
          {/* <p className="font-bold">
            মোট বাকিঃ{' '}
            <span className="font-normal">
              {((loan?.remaining_payable_amount || 0) / 100).toFixed(2)} টাকা
            </span>
          </p> */}
        </div>
      </div>
      <div className="mx-2 md:mx-0">
        <div className="grid grid-cols-1 md:grid-cols-3 my-3 container mx-auto gap-4">
          <div>
            <h2 className="font-bold text-center">সঞ্চয়ের তালিকা</h2>
            {deposit_collections.length === 0 ? (
              <p className="text-center mt-4">কোনো সঞ্চয় পাওয়া যায়নি।</p>
            ) : (
              deposit_collections.map((collection) => {
                return (
                  <div
                    key={collection?.id}
                    className="border-b p-1 flex justify-between items-center"
                  >
                    <p className="font-bold">
                      তারিখঃ <br />
                      <span className="font-normal">
                        {dayjs(collection?.deposit_date).format('D MMMM YYYY')}
                      </span>
                    </p>
                    <p className="font-bold">
                      পরিমাণঃ <br />
                      <span className="font-normal">
                        {(collection?.deposit_amount / 100).toFixed(2)} টাকা
                      </span>
                    </p>
                    {new Date().toISOString().split('T')[0] ===
                      collection?.deposit_date && (
                      <p className="hover:cursor-pointer" onClick={onOpenModal}>
                        <Pencil className="text-blue-700" />
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <DepositCollectionUpdateModal
            open={open}
            onCloseModal={onCloseModal}
            collection={todays_collection}
          />
          <div>
            <h2 className="font-bold text-center">কিস্তির তালিকা</h2>
            {loan_collections.length === 0 ? (
              <p className="text-center mt-4">কোনো কিস্তি পাওয়া যায়নি।</p>
            ) : (
              loan_collections.map((collection) => {
                return (
                  <div
                    key={collection?.id}
                    className="border-b p-1 flex justify-between items-center"
                  >
                    <p className="font-bold">
                      তারিখঃ <br />
                      <span className="font-normal">
                        {dayjs(collection?.created_at).format('D MMMM YYYY')}
                      </span>
                    </p>
                    <p className="font-bold">
                      পরিমাণঃ <br />
                      <span className="font-normal">
                        {(collection?.paid_amount / 100).toFixed(2)} টাকা
                      </span>
                    </p>
                    {new Date().toISOString().split('T')[0] ===
                      collection?.paying_date && (
                      <p
                        className="hover:cursor-pointer"
                        onClick={onOpenLoanModal}
                      >
                        <Pencil className="text-blue-700" />
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <LoanCollectionUpdateModal
            open={openLoanModal}
            onCloseModal={onCloseLoanModal}
            collection={todays_loan_collection}
          />
          <div>
            <h2 className="font-bold text-center">টাকা উত্তোলন তালিকা</h2>
            {withdraws.length === 0 ? (
              <p className="text-center mt-4">কোনো উত্তোলন পাওয়া যায়নি।</p>
            ) : (
              withdraws.map((withdraw) => {
                return (
                  <div
                    key={withdraw?.id}
                    className="border-b p-1 flex justify-between items-center"
                  >
                    <p className="font-bold">
                      তারিখঃ <br />
                      <span className="font-normal">
                        {dayjs(withdraw?.created_at).format('D MMMM YYYY')}
                      </span>
                    </p>
                    <p className="font-bold">
                      পরিমাণঃ <br />
                      <span className="font-normal">
                        {(withdraw?.withdraw_amount / 100).toFixed(2)} টাকা
                      </span>
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </EmployeeBankLayout>
  );
}

export default EmployeeMemberDetails;
