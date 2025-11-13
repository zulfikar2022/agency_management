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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {products?.data?.length === 0 && (
        <div>
          <p className="text-center">কোন পণ্য পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}

export default ProductTable;
