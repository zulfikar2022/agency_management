import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import { useState } from 'react';
import ResponsiveTable from '@/Pages/Employee/components/ResponsiveTable';
import Pagination from '../../components/Pagination';

function HavePaidToday({ customers, totalCustomers }) {
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
      <h1 className="font-bold text-center text-2xl">যারা আজ টাকা দিয়েছে</h1>
      <ResponsiveTable data={tableData} actionData={actionData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </LayoutForProduct>
  );
}

export default HavePaidToday;
