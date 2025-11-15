import { useState } from 'react';
import LayoutForProduct from '../layouts/LayoutForProduct';
import Pagination from '../components/Pagination';
import CustomersTable from '../components/CustomersTable';
import { usePage } from '@inertiajs/react';
import GoBack from '../components/GoBack';

function ShowAllCustomers({ customers, user }) {
  const { previousUrl } = usePage().props;
  let paginationData = { ...customers, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <LayoutForProduct>
      <GoBack previousUrl={previousUrl} />
      <div>
        <h1 className="text-center mt-3 text-3xl ">সকল কাস্টমার</h1>
        <CustomersTable customers={customers?.data} />
      </div>
      {customers.data.length > 0 && (
        <Pagination paginationData={paginationData} />
      )}
    </LayoutForProduct>
  );
}

export default ShowAllCustomers;
