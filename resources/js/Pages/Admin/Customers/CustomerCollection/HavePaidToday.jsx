import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import { useState } from 'react';
import ResponsiveTable from '@/Pages/Employee/components/ResponsiveTable';
import Pagination from '../../components/Pagination';
import { Link } from '@inertiajs/react';

function HavePaidToday({ customers, totalCustomers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };

  const tableData = customerTableDataGenerateForEmployee(data);
  // find todays date in YYYY-MM-DD format
  const todate = new Date().toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState('');
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
      <h1 className="font-bold text-center text-2xl">যারা আজ টাকা দিয়েছে</h1>
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
            href={route('admin.customerHaveToPayToday', {
              todate: todate,
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

export default HavePaidToday;
