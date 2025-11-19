import ResponsiveTable from '@/Pages/Employee/components/ResponsiveTable';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import Pagination from '../../components/Pagination';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import { useState } from 'react';

function HaveNotPaidToday({ customers, totalCustomers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };

  const tableData = customerTableDataGenerateForEmployee(data);
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
      <h1 className="font-bold text-center text-2xl">যারা আজ টাকা দেয়নি</h1>
      <ResponsiveTable data={tableData} actionData={actionData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </LayoutForProduct>
  );
}

export default HaveNotPaidToday;
