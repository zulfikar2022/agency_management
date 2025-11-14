import { WEEKDAYS } from '@/constants';
import LayoutForProduct from '../layouts/LayoutForProduct';

function ShowCustomerDetails({ customer }) {
  const collectionDayLabel = WEEKDAYS.find(
    (day) => day.value === customer.collection_day
  )?.label;
  return (
    <LayoutForProduct>
      <div>
        <h1 className="text-center mt-3 text-3xl ">গ্রাহকের বিস্তারিত তথ্য</h1>

        <div className="mx-4 md:mx-10 mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
          <div className="border-b md:border-r md:border-b-0 pr-6 pb-6">
            <p>
              <strong>নাম:</strong> {customer.name}
            </p>
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
          <div className=" sm:mt-5 md:pl-5 md:mt-0">
            <h1>Calculations</h1>
          </div>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default ShowCustomerDetails;
