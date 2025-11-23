import ResponsiveTable from '@/Pages/Employee/components/ResponsiveTable';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import Pagination from '../../components/Pagination';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

function HaveNotPaidToday({ customers, totalCustomers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };

  const tableData = customerTableDataGenerateForEmployee(data);
  const [searchTerm, setSearchTerm] = useState('');
  // find today as sunday, monday etc and todate as YYYY-MM-DD
  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  const todate = new Date().toISOString().split('T')[0];
  const actionData = [
    {
      label: 'বিস্তারিত দেখুন',
      routeName: 'admin.showCustomerDetails',
      routeHasParameter: true,
      paramName: 'id',
    },
  ];
  return (
    <LayoutForProduct>
      <h1 className="font-bold text-center text-2xl">যারা আজ টাকা দেয়নি</h1>
      <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4 ml-3 md:ml-5 ">
        <div className="flex flex-col md:flex-row mb-4 mr-3 md:mr-0 ">
          <input
            type="text"
            placeholder="কাস্টমার অনুসন্ধান করুন..."
            className="input input-bordered w-full max-w-xs mr-2 mb-2 md:mb-0"
            value={searchTerm}
            name="search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            href={route('admin.customersDidNotPayToday', {
              todate: todate,
              today: today,
              search: searchTerm,
            })}
            className="btn btn-neutral w-[150px]"
          >
            অনুসন্ধান করুন
          </Link>
        </div>
      </div>
      <ResponsiveTable data={tableData} actionData={actionData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </LayoutForProduct>
  );
}

export default HaveNotPaidToday;
