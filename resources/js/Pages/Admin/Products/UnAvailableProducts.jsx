import { Link, usePage } from '@inertiajs/react';
import Pagination from '../components/Pagination';
import ProductTable from '../components/ProductTable';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { useState } from 'react';
import GoBack from '../components/GoBack';

function InAvailableProducts({ products, user }) {
  const { previousUrl } = usePage().props;
  let paginationData = { ...products, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <LayoutForProduct>
      <div className="flex flex-col  justify-evenly">
        <h1 className="text-center mt-3 text-3xl ">আনএভেইলেবল পন্যসমূহ</h1>
        <div className="mb-4 flex sm: flex-col gap-2  md:flex-row items-center md:ml-3.5">
          <input
            type="text"
            placeholder="পণ্য অনুসন্ধান করুন..."
            className="input input-bordered w-full max-w-xs mr-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            href={route('admin.showUnavailableProducts', {
              search: searchTerm,
            })}
            className="btn btn-neutral"
          >
            অনুসন্ধান করুন
          </Link>
        </div>
        <ProductTable products={products?.data} />
        {products?.data?.length > 0 && (
          <div>
            <Pagination paginationData={paginationData} />
          </div>
        )}
      </div>
    </LayoutForProduct>
  );
}

export default InAvailableProducts;
