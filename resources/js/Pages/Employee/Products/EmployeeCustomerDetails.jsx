import { WEEKDAYS } from '@/constants';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import ResponsiveCustomerDetailsTable from '@/Pages/Admin/components/ResponsiveCustomerDetailsTable';
import ResponsiveCustomerDetailsTableForEmployee from '../components/ResponsiveCustomerDetailsTableForEmployee';
import CollectionListTable from '../components/CollectionListTable';

function EmployeeCustomerDetails({ customer, purchases, collections }) {
  console.log(purchases);

  const totalPrice = purchases.reduce(
    (total, purchase) => total + (purchase?.total_payable_price || 0),
    0
  );

  const totalRemainingPayable = purchases.reduce(
    (total, purchase) => total + (purchase?.remaining_payable_price || 0),
    0
  );
  const totalDownpayment = purchases.reduce(
    (total, purchase) => total + (purchase?.downpayment || 0),
    0
  );
  console.log(totalDownpayment);
  return (
    <EmployeeProductLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4 border-b text-center md:container mx-2 md:mx-auto pb-2">
          কাস্টমারের বিস্তারিত তথ্য
        </h1>
        <div className="p-5 border-b container md:mx-auto mb-6 flex flex-col md:flex-row h-full md:justify-between">
          <div className="">
            <p>
              <strong> কাস্টমার আইডিঃ</strong> {customer.id}
            </p>
            <p>
              <span className="font-semibold">কাস্টমার নাম:</span>{' '}
              {customer?.name}
            </p>

            <p>
              <span className="font-semibold">কাস্টমার ফোন:</span>{' '}
              {customer?.phone_number}
            </p>
            <p>
              <span className="font-semibold">ঠিকানা:</span> {customer?.address}
            </p>
            <p>
              <span className="font-semibold">টাকা সংগ্রহের দিন:</span>{' '}
              {
                WEEKDAYS.find((day) => day.value === customer?.collection_day)
                  ?.label
              }
            </p>
          </div>
          {/* আরও কাস্টমার সম্পর্কিত তথ্য এখানে দেখানো যেতে পারে */}

          <div className="flex flex-col mt-4 md:mt-0 items-start">
            <p className="  text-center">
              <span className="font-bold">পণ্যের মোট মূল্যঃ</span> {totalPrice}{' '}
              টাকা
            </p>
            <p className="  text-center">
              <span className="font-bold">মোট ডাউনপেমেন্টঃ</span>{' '}
              {totalDownpayment} টাকা
            </p>
            <p className="  text-center">
              <span className="font-bold">কিস্তিতে মোট পরিশোধঃ</span>{' '}
              {totalPrice - totalRemainingPayable - totalDownpayment} টাকা
            </p>
            <p className="  text-center">
              <span className="font-bold">মোট পরিশোধিত পরিমানঃ</span>{' '}
              {totalPrice - totalRemainingPayable} টাকা
            </p>
            <p className="  text-center">
              <span className="font-bold">মোট সাপ্তাহিক পরিশোধযোগ্যঃ</span>{' '}
              {purchases.reduce(
                (total, purchase) =>
                  total + (purchase?.weekly_payable_price || 0),
                0
              )}{' '}
              টাকা
            </p>
            <p className="  text-center">
              <span className="font-bold">মোট বাকি আছেঃ</span>{' '}
              {totalRemainingPayable} টাকা
            </p>
          </div>
        </div>
      </div>

      <ResponsiveCustomerDetailsTableForEmployee
        purchagedProducts={purchases}
      />

      {collections && collections.length > 0 && (
        <CollectionListTable collections={collections} />
      )}
    </EmployeeProductLayout>
  );
}

export default EmployeeCustomerDetails;
