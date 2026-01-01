import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '../components/Pagination';
import ProductTable from '../components/ProductTable';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { useState } from 'react';
import GoBack from '../components/GoBack';
import ResponsiveProductTable from '../components/ResponsiveProductTable';

function InAvailableProducts({ products, user, search, numberOfProducts }) {
  const { previousUrl } = usePage().props;
  let paginationData = { ...products, data: [] };
  const [searchTerm, setSearchTerm] = useState(search || '');
  return (
    <LayoutForProduct>
      <Head title="আনএভেইলেবল পন্যসমূহ" />
      <div className="flex flex-col  justify-evenly">
        <h1 className="text-center mt-3 text-3xl ">আনএভেইলেবল পন্যসমূহ</h1>
        <p className="text-center ">
          মোট আনএভেইলেবল পণ্য: {numberOfProducts} টি
        </p>
        <p className="text-center ">
          এই পৃষ্ঠায় পণ্য আছেঃ {products?.data?.length} টি
        </p>
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
          <Link
            href={route('admin.showUnavailableProducts', { search: '' })}
            className="btn btn-neutral"
          >
            সকল পণ্য দেখুন
          </Link>
        </div>
        <ResponsiveProductTable data={products?.data} />
        {products?.data?.length > 0 && (
          <div>
            <Pagination
              paginationData={paginationData}
              queryParams={{ search: searchTerm }}
            />
          </div>
        )}
      </div>
    </LayoutForProduct>
  );
}

export default InAvailableProducts;
