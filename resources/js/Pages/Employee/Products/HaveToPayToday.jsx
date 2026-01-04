import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import ResponsiveTable from '../components/ResponsiveTable';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import dayjs from 'dayjs';

function HaveToPayToday({ customers, totalCustomers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };
  const tableData = customerTableDataGenerateForEmployee(data);
  const today = dayjs().format('dddd').toLowerCase();
  const todate = new Date().toISOString().split('T')[0];
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
      <Head title="আজ যারা টাকা দেবে" />
      <div className="container mx-auto">
        <p className="text-lg font-semibold text-center my-5">
          আজ যারা টাকা দেবে
        </p>
        <p className="text-center">
          মোট কাস্টমার: <span className="font-bold">{totalCustomers}</span> জন
        </p>
        <p className="text-center">
          এই পৃষ্ঠায় আছেন: <span className="font-bold">{data?.length}</span> জন
        </p>
        <div className="ml-3 md:ml-5">
          <div className="flex flex-col md:flex-row mb-4 mr-2">
            <input
              type="text"
              placeholder="কাস্টমার অনুসন্ধান করুন..."
              className="input input-bordered w-full max-w-xs mr-2 mb-2 md:mb-0"
              value={searchTerm}
              name="search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Link
              href={route('employee.customersThatPayToday', {
                search: searchTerm,
                today: today,
              })}
              className="btn btn-neutral w-[150px]"
            >
              অনুসন্ধান করুন
            </Link>
          </div>
        </div>
        <ResponsiveTable data={tableData} actionData={actionData} />
        {data?.length > 0 && (
          <Pagination
            paginationData={pagination}
            queryParams={{ today, todate }}
          />
        )}
      </div>
    </EmployeeProductLayout>
  );
}

export default HaveToPayToday;
