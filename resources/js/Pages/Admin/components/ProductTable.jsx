import { Link } from '@inertiajs/react';

function ProductTable({ products }) {
  return (
    <div className="mx-1 md:mx-4 my-8">
      {products?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>পণ্যের নাম</th>
                <th>সরবরাহকারী প্রতিষ্ঠানের নাম</th>
                <th>ক্রয়কৃত পরিমাণ</th>
                <th>বর্তমান পরিমাণ</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}

              {products.map((product) => (
                <tr
                  key={product.id}
                  className={product?.is_available ? '' : 'bg-red-200'}
                >
                  <td>{product.name}</td>
                  <td>{product.supplier_name}</td>
                  <td>{product.initial_quantity}</td>
                  <td>{product.current_quantity}</td>

                  <td className="p-0 m-0">
                    <Link
                      className="btn btn-xs btn-outline"
                      href={route('admin.showProductById', product.id)}
                    >
                      বিস্তারিত
                    </Link>
                  </td>
                  <td className="p-0 m-0">
                    <Link
                      className="btn btn-xs btn-outline"
                      href={route('admin.showUpdateProductPage', product.id)}
                    >
                      আপডেট করুন
                    </Link>
                  </td>

                  <td className="p-0 m-0">
                    <Link
                      className="btn btn-xs btn-outline"
                      href={route('admin.toggleProductStatus', product.id)}
                    >
                      {product?.is_available
                        ? 'আনএভেইলেবল করুন'
                        : 'অ্যাভেইলেবল করুন'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {products?.length === 0 && (
        <div>
          <p className="text-center">কোন পণ্য পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}

export default ProductTable;
