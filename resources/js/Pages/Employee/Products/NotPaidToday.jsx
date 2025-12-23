import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import ResponsiveTable from '../components/ResponsiveTable';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';

function NotPaidToday({ customers, totalCustomers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  const todate = dayjs().format('YYYY-MM-DD');
  const today = dayjs().format('dddd').toLowerCase();

  const tableData = customerTableDataGenerateForEmployee(data);
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
      <div className="container mx-auto">
        <p className="text-lg font-semibold text-center my-5">
          আজ যারা টাকা দেয়নি
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
              href={route('employee.customersWhoDidntPayToday', {
                search: searchTerm,
                todate,
                today,
              })}
              className="btn btn-neutral w-[150px]"
            >
              অনুসন্ধান করুন
            </Link>
          </div>
        </div>
        <ResponsiveTable data={tableData} actionData={actionData} />
        {data?.length > 0 && <Pagination paginationData={pagination} />}
      </div>
    </EmployeeProductLayout>
  );
}

export default NotPaidToday;
