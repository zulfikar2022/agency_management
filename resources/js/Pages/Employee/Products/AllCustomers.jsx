import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import ResponsiveTable from '../components/ResponsiveTable';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { WEEKDAYS } from '@/constants';

function AllCustomers({ customers, totalCustomers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };

  const tableData = customerTableDataGenerateForEmployee(data);
  const [searchTerm, setSearchTerm] = useState('');
  const actionData = [
    {
      label: 'কালেকশন করুন',
      routeName: 'employee.renderCollectionPage',
      routeHasParameter: true,
      paramName: 'id',
    },
    {
      label: 'বিস্তারিত দেখুন',
      routeName: 'employee.customerDetails',
      routeHasParameter: true,
      paramName: 'id',
    },
  ];

  return (
    <EmployeeProductLayout>
      <p className="text-lg font-semibold text-center my-5">সকল কাস্টমার</p>
      <p className="text-center">
        মোট কাস্টমার: <span className="font-bold">{totalCustomers}</span> জন
      </p>
      <p className="text-center">
        এই পৃষ্ঠায় আছেন: <span className="font-bold">{data?.length}</span> জন
      </p>
      <div className="ml-7 md:ml-20 flex flex-col md:flex-row gap-4 mt-5 justify-evenly">
        <div className="flex flex-col md:flex-row mb-4">
          <input
            type="text"
            placeholder="কাস্টমার অনুসন্ধান করুন..."
            className="input input-bordered w-full max-w-xs mr-3 mb-3 md:mb-0"
            value={searchTerm}
            name="search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            href={route('employee.allCustomers', { search: searchTerm })}
            className="btn btn-neutral w-[150px]"
          >
            অনুসন্ধান করুন
          </Link>
        </div>
        <div className="flex flex-col md:flex-row mb-4">
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
            href={route('employee.allCustomers', { day: searchTerm })}
            className="btn btn-neutral w-[150px] mt-5 md:mt-0 ml-0 md:ml-3"
          >
            ফিল্টার করুন
          </Link>
        </div>
      </div>
      <ResponsiveTable data={tableData} actionData={actionData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </EmployeeProductLayout>
  );
}

export default AllCustomers;

// b-4 flex flex-col content-start  gap-2  md:flex-row items-center md:ml-3.5 mb-4
