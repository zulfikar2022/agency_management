import { Link } from '@inertiajs/react';

function ResponsiveProductTable({ data }) {
  if (data.length === 0) {
    return <div className="text-center my-10 text-gray-500">কোন পণ্য নেই</div>;
  }
  console.log(data);
  return (
    <div>
      {data?.map((product, index) => {
        return (
          <div
            key={product.id}
            className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-13 gap-4 px-5 py-2 border-b justify-center  items-center ${product?.is_available ? '' : 'bg-red-100'}`}
          >
            <div className="flex flex-col col-span-2">
              <p className="font-bold">পণ্যের নামঃ</p>
              <p>{product.name}</p>
            </div>
            <div className="flex flex-col col-span-2">
              <p className="font-bold">সরবরাহকারী প্রতিষ্ঠানের নামঃ</p>
              <p>{product.supplier_name}</p>
            </div>
            <div className="flex flex-col col-span-2">
              <p className="font-bold">ক্রয়কৃত পরিমাণঃ </p>
              <p>{product?.initial_quantity}</p>
            </div>
            <div className="flex flex-col col-span-2">
              <p className="font-bold">বর্তমান পরিমাণঃ </p>
              <p>{product?.current_quantity}</p>
            </div>
            <div className="flex flex-col col-span-2">
              <p className="font-bold">স্টকের পণ্যের মোট মূল্যঃ </p>
              <p>
                {product?.current_quantity * product?.buying_price_per_product}
              </p>
            </div>
            <div className="flex flex-row gap-2 col-span-3">
              <Link
                href={route('admin.showProductById', { id: product.id })}
                className="btn btn-xs btn-outline"
              >
                বিস্তারিত
              </Link>
              <Link
                href={route('admin.showUpdateProductPage', { id: product.id })}
                className="btn btn-xs btn-outline"
              >
                আপডেট করুন
              </Link>
              <Link
                href={route('admin.toggleProductStatus', { id: product.id })}
                className="btn btn-xs btn-outline"
              >
                {product?.is_available ? 'আনএভেইলেবল করুন' : 'অ্যাভেইলেবল করুন'}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResponsiveProductTable;
