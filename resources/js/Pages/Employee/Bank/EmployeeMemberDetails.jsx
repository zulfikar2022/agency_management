import dayjs from 'dayjs';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import DepositCollectionUpdateModal from './DepositCollectionUpdateModal';

function EmployeeMemberDetails({
  member,
  total_deposited_amount,
  deposit_collections,
}) {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const todays_collection = deposit_collections.find((collection) => {
    return collection.deposit_date === new Date().toISOString().split('T')[0];
  });

  const handleEditDepositCollection = (e) => {
    console.log('Edit deposit collection clicked');
  };
  return (
    <EmployeeBankLayout>
      <div className="mx-2 md:mx-0">
        <div className="container mx-auto border p-4 mt-4 rounded-lg">
          <p className="font-bold">
            সদস্যের নামঃ <span className="font-normal">{member.name}</span>
          </p>
          <p className="font-bold">
            মোট সঞ্চয়ঃ{' '}
            <span className="font-normal">{total_deposited_amount / 100}</span>
          </p>
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
                        {collection?.deposit_amount / 100} টাকা
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
          </div>
          <div>
            <h2 className="font-bold text-center">টাকা উত্তোলন তালিকা</h2>
          </div>
        </div>
      </div>
    </EmployeeBankLayout>
  );
}

export default EmployeeMemberDetails;
