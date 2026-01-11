import { Head, Link, usePage } from '@inertiajs/react';
import LayoutForProduct from '../layouts/LayoutForProduct';
import GoBack from '../components/GoBack';

function ShowProductDetails({ product, update_logs }) {
  const { previousUrl } = usePage().props;
  // console.log('Product Details:', product);
  return (
    <LayoutForProduct>
      <Head title={`পণ্যের বিস্তারিত: ${product?.name}`} />
      <GoBack
        targetRouteName="admin.showProducts"
        text="পণ্য তালিকায় ফিরে যান"
      />
      <div className="h-full">
        <div className="flex flex-col justify-center items-center my-10 p-5">
          <div
            className={`border rounded-lg shadow-lg p-6 w-full max-w-md ${product.is_available ? 'bg-green-200' : 'bg-red-200'}`}
          >
            <h1 className="text-2xl font-bold">পণ্যের বিস্তারিত তথ্য</h1>
            <p>
              <span className="font-bold">নামঃ </span> {product.name}
            </p>
            <p>
              <span className="font-bold">সরবরাহকারীঃ </span>{' '}
              {product.supplier_name}
            </p>
            <p>
              <span className="font-bold">ক্রয়কৃত পরিমাণঃ </span>{' '}
              {product.initial_quantity} টি
            </p>
            <p>
              <span className="font-bold">বর্তমান পরিমাণঃ </span>{' '}
              {product.current_quantity} টি
            </p>
            <p>
              <span className="font-bold">একটি পণ্যের ক্রয়মূল্যঃ </span>{' '}
              {product.buying_price_per_product} টাকা
            </p>
            <p>
              <span className="font-bold">স্টকের পণ্যের মোট ক্রয়মূল্যঃ </span>{' '}
              {product.current_quantity * product.buying_price_per_product} টাকা
            </p>
            <p>
              <span className="font-bold">অবস্থাঃ</span>{' '}
              {product.is_available ? 'এভেইলেবল' : 'আনএভেইলেবল'}
            </p>
            <div>
              <Link
                className="btn btn-xs btn-outline mr-3"
                href={route('admin.showUpdateProductPage', product.id)}
              >
                <button className="">পণ্য আপডেট করুন</button>
              </Link>

              <Link
                className="btn btn-xs btn-outline"
                href={route('admin.toggleProductStatus', product.id)}
              >
                {product.is_available ? 'আনএভেইলেবল করুন' : 'অ্যাভেইলেবল করুন'}
              </Link>
            </div>
          </div>

          {/* <div className="my-3">
          <h2 className="text-xl font-bold mb-4">আপডেট ইতিহাস</h2>
          {update_logs && update_logs.length > 0 ? (
            <ul className="list-disc pl-5">
              {update_logs.map((log) => (
                <li key={log.id} className="mb-2">
                  <p>
                    <span className="font-bold">তারিখ:</span>{' '}
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">পরিবর্তন:</span>{' '}
                    {log.change_description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>কোন আপডেট ইতিহাস পাওয়া যায়নি।</p>
          )}
        </div> */}
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default ShowProductDetails;
