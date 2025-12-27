import { Link } from '@inertiajs/react';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';
import { dateFormatter } from '@/utilityFuntion';
import dayjs from 'dayjs';

const Dashboard = ({
  user,
  loan_collections,
  deposit_collections,
  product_collections,
}) => {
  console.log(loan_collections);
  console.log(deposit_collections);
  console.log(product_collections);
  const total_loan_collections =
    loan_collections.reduce(
      (total, collection) => total + collection.paid_amount,
      0
    ) / 100;
  const total_deposit_collections =
    deposit_collections.reduce(
      (total, collection) => total + collection.deposit_amount,
      0
    ) / 100;
  const total_product_collections = product_collections.reduce(
    (total, collection) => total + collection.collected_amount,
    0
  );
  return (
    <EmployeeDashboardLayout>
      <div className="container mx-auto p-5 md:p-0">
        <p className="font-bold text-center text-2xl my-5">
          আজকের তারিখঃ{' '}
          <span className="font-normal">{dateFormatter(dayjs())} </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-5">
          <div className="my-5">
            <p className="font-bold">
              এমপ্লয়ীর আইডিঃ <span className="font-normal">{user?.id}</span>
            </p>
            <p className="font-bold">
              {' '}
              এমপ্লয়ীর নামঃ &nbsp; &nbsp;&nbsp;
              <span className="font-normal">{user?.name}</span>
            </p>
            <p className="font-bold">
              এমপ্লয়ীর ইমেইলঃ <span className="font-normal">{user?.email}</span>
            </p>
          </div>
          <div>
            <p className="font-bold">
              ঋণের কিস্তি বাবদ আজকের কালেকশনঃ{' '}
              <span className="font-normal">
                {total_loan_collections} টাকা
              </span>{' '}
            </p>
            <p className="font-bold">
              সঞ্চয় বাবদ আজকের কালেকশনঃ{' '}
              <span className="font-normal">
                {total_deposit_collections} টাকা
              </span>{' '}
            </p>
            <p className="font-bold">
              পণ্য বাবদ আজকের কালেকশনঃ{' '}
              <span className="font-normal">
                {total_product_collections} টাকা
              </span>{' '}
            </p>
          </div>
        </div>
      </div>
    </EmployeeDashboardLayout>
  );
};

export default Dashboard;
