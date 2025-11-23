import { useState } from 'react';
import LayoutForProduct from '../layouts/LayoutForProduct';
import Pagination from '../components/Pagination';
import CustomersTable from '../components/CustomersTable';
import { Link, usePage } from '@inertiajs/react';
import GoBack from '../components/GoBack';
import { WEEKDAYS } from '@/constants';
import ResponsiveCustomerTable from '../components/ResponsiveCustomerTable';

function ShowAllCustomers({ customers, user, totalCustomers }) {
  console.log('totalCustomers:', totalCustomers);
  const { previousUrl } = usePage().props;
  let paginationData = { ...customers, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <LayoutForProduct>
      <h1 className="text-center mt-3 text-3xl ">সকল কাস্টমার</h1>
      <div className="my-6">
        <p className="text-center">
          মোট কাস্টমারঃ <span className="font-bold">{totalCustomers}</span> জন
        </p>
        <p className="text-center">
          {' '}
          এই পৃষ্ঠায় আছেনঃ{' '}
          <span className="font-bold">{customers?.data.length}</span> জন
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-evenly items-center mb-4">
        <div className="mb-4 flex flex-col content-start  gap-2  md:flex-row items-center md:ml-3.5">
          <input
            type="text"
            placeholder="কাস্টমার অনুসন্ধান করুন..."
            className="input input-bordered w-full max-w-xs mr-3"
            value={searchTerm}
            name="search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            href={route('admin.showCustomers', { search: searchTerm })}
            className="btn btn-neutral"
          >
            অনুসন্ধান করুন
          </Link>
        </div>
        <div className="b-4 flex flex-col content-start  gap-2  md:flex-row items-center md:ml-3.5">
          {/* make a dropdown to select a day from weekdays  */}
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => {
              const selectedDay = e.target.value;
              setSearchTerm(selectedDay);
            }}
          >
            <option value={''} selected>
              কালেকশন ডে দ্বারা ফিল্টার করুন
            </option>
            {WEEKDAYS.map((day) => {
              return (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              );
            })}
          </select>
          <Link
            href={route('admin.showCustomers', { search: searchTerm })}
            className="btn btn-neutral"
          >
            ফিল্টার করুন
          </Link>
        </div>
      </div>
      <div>
        {/* <CustomersTable customers={customers?.data} /> */}

        <div className="">
          <ResponsiveCustomerTable data={customers?.data} />
        </div>
      </div>
      {customers.data.length > 0 && (
        <Pagination paginationData={paginationData} />
      )}
    </LayoutForProduct>
  );
}

export default ShowAllCustomers;
