import { WEEKDAYS } from '@/constants';
import { Link } from '@inertiajs/react';

function CustomersTable({ customers }) {
  return (
    <div>
      {customers.length > 0 ? (
        <div className="overflow-x-auto mx-10">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>নাম</th>
                <th>ফোন নম্বর</th>
                <th>ঠিকানা</th>
                <th>টাকা সংগ্রহের দিন</th>
                <th>একশন</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const collectionDayLabel = WEEKDAYS.find(
                  (day) => day.value === customer.collection_day
                )?.label;
                return (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.phone_number}</td>
                    <td>{customer.address}</td>
                    <td>{collectionDayLabel}</td>
                    <td className="">
                      {' '}
                      <Link
                        className="btn btn-xs btn-outline"
                        href={route('admin.showCustomerDetails', customer.id)}
                      >
                        বিস্তারিত দেখুন
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={route('admin.editCustomer', customer.id)}
                        className="btn btn-xs btn-outline"
                      >
                        আপডেট করুন
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-5">কোনো গ্রাহক পাওয়া যায়নি।</p>
      )}
    </div>
  );
}

export default CustomersTable;
