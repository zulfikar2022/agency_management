import { useState } from 'react';
import LayoutForProduct from '../layouts/LayoutForProduct';
import Pagination from '../components/Pagination';
import CustomersTable from '../components/CustomersTable';
import { Link, usePage } from '@inertiajs/react';
import GoBack from '../components/GoBack';

function ShowAllCustomers({ customers, user }) {
  const { previousUrl } = usePage().props;
  let paginationData = { ...customers, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <LayoutForProduct>
      <div className="mb-4 flex sm: flex-col gap-2  md:flex-row items-center md:ml-3.5">
        <input
          type="text"
          placeholder="কাস্টমার অনুসন্ধান করুন..."
          className="input input-bordered w-full max-w-xs mr-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Link
          href={route('admin.showCustomers', { search: searchTerm })}
          className="btn btn-neutral"
        >
          অনুসন্ধান করুন
        </Link>
      </div>
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
