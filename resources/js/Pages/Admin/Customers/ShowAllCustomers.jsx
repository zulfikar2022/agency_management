import { useState } from 'react';
import LayoutForProduct from '../layouts/LayoutForProduct';
import Pagination from '../components/Pagination';
import CustomersTable from '../components/CustomersTable';

function ShowAllCustomers({ customers, user }) {
  let paginationData = { ...customers, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <LayoutForProduct>
      <div>
        <h1 className="text-center mt-3 text-3xl ">সকল গ্রাহক</h1>
        <CustomersTable customers={customers?.data} />
      </div>
      {customers.data.length > 0 && (
        <Pagination paginationData={paginationData} />
      )}
    </LayoutForProduct>
  );
}

export default ShowAllCustomers;
