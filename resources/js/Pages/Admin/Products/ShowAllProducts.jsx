import { Link, usePage } from '@inertiajs/react';
import Pagination from '../components/Pagination';
import ProductTable from '../components/ProductTable';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { useState } from 'react';
import GoBack from '../components/GoBack';
import ResponsiveTable from '@/Pages/Employee/components/ResponsiveTable';
import ResponsiveProductTable from '../components/ResponsiveProductTable';

// আইডি
// পণ্যের নাম
// সরবরাহকারী প্রতিষ্ঠানের নাম
// ক্রয় কৃত পরিমাণ
// বর্তমান পরিমাণ

// বাটন সমূহ - বিস্তারিত, আপডেট করুন, এভেইলেবল করুন

function ShowAllProducts({ user, products, search, numberOfProducts }) {
  let paginationData = { ...products, data: [] };
  const [searchTerm, setSearchTerm] = useState(search || '');

  return (
    <LayoutForProduct>
      <div className="flex flex-col  justify-between">
        <h1 className="text-center mt-3 text-3xl ">সকল পণ্য</h1>
        <p className="text-center ">মোট পণ্য: {numberOfProducts} টি</p>
        <p className="text-center ">
          এই পৃষ্ঠায় পণ্য আছেঃ {products?.data?.length} টি
        </p>
        <div className="mb-4 flex sm: flex-col gap-2  md:flex-row items-center ml-3.5 md:ml-5">
          <input
            type="text"
            placeholder="পণ্য অনুসন্ধান করুন..."
            className="input input-bordered w-full max-w-xs mr-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            href={route('admin.showProducts', { search: searchTerm })}
            className="btn btn-neutral"
          >
            অনুসন্ধান করুন
          </Link>
          <Link
            href={route('admin.showProducts', { search: '' })}
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

export default ShowAllProducts;
