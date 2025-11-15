import { WEEKDAYS } from '@/constants';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { Link, usePage } from '@inertiajs/react';
import GoBack from '../components/GoBack';

function ShowCustomerDetails({ customer, purchagesLists }) {
  console.log('customer:', customer);
  const { previousUrl } = usePage().props;
  const totalRemainingPayable = purchagesLists.reduce(
    (total, item) => total + item.remaining_payable_price,
    0
  );

  const collectionDayLabel = WEEKDAYS.find(
    (day) => day.value === customer.collection_day
  )?.label;
  return (
    <LayoutForProduct>
      <GoBack previousUrl={previousUrl} />
      <div>
        <h1 className="text-center mt-3 text-3xl ">
          কাস্টমারের বিস্তারিত তথ্য
        </h1>

        <div className="mx-auto md:mx-auto mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row md:justify-between md:w-3/4 lg:w-2/4 ">
          <div className="border-b md:border-r md:border-b-0 pr-6 pb-6">
            <p>
              <strong>নাম:</strong> {customer.name}
            </p>
            {customer.fathers_name && (
              <p>
                <strong>পিতার নাম:</strong> {customer.fathers_name}
              </p>
            )}
            {customer.mothers_name && (
              <p>
                <strong>মাতার নাম:</strong> {customer.mothers_name}
              </p>
            )}
            {customer.nid_number && (
              <p>
                <strong>এনআইডি নম্বর:</strong> {customer.nid_number}
              </p>
            )}
            <p>
              <strong>ফোন নম্বর:</strong> {customer.phone_number}
            </p>
            <p>
              <strong>ঠিকানা:</strong> {customer.address}
            </p>
            <p>
              <strong>টাকা সংগ্রহের দিন:</strong> {collectionDayLabel}
            </p>
          </div>
          <div className="border-b md:border-r md:border-b-0 pr-6 pb-6">
            <p>
              বাকি আছেঃ{' '}
              <span className="font-bold">{totalRemainingPayable}</span> টাকা
            </p>
          </div>
          <div className="flex flex-col justify-between">
            <Link
              href={route('admin.editCustomer', customer.id)}
              className="btn btn-xs btn-outline mb-3"
            >
              কাস্টমারের তথ্য আপডেট করুন
            </Link>
            <Link
              href={route('admin.sellProductToCustomerPage', customer.id)}
              className="btn btn-xs btn-neutral mb-3"
            >
              পণ্য বিক্রয় করুন
            </Link>
          </div>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default ShowCustomerDetails;

// admin.sellProductToCustomerPage;
