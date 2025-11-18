import { Link } from '@inertiajs/react';

function ResponsiveCustomerDetailsTable({ purchagedProducts }) {
  console.log(purchagedProducts);
  if (purchagedProducts.length === 0) {
    return <div className="text-center my-10 text-gray-500">কোন পণ্য নেই</div>;
  }
  return (
    <div className="mt-10 mb-5">
      {purchagedProducts?.map((item, index) => {
        return (
          <div
            key={item?.id}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 border-b px-5 py-2 container mx-auto"
          >
            <div className="">
              <p className="font-bold">পণ্যের নামঃ </p>
              <p>{item?.product?.name}</p>
            </div>
            <div className="">
              <p className="font-bold">ক্রয়কৃত পরিমাণঃ</p>
              <p>{item?.quantity}</p>
            </div>
            <div className="">
              <p className="font-bold">মোট মূল্যঃ </p>
              <p>{item?.total_payable_price}</p>
            </div>
            <div className="">
              <p className="font-bold">বাকি আছেঃ </p>
              <p>{item?.remaining_payable_price}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Link
                href={route('admin.showCustomerPurchaseDetails', {
                  customer_id: item?.customer_id,
                  purchase_id: item?.id,
                })}
                className="btn btn-xs btn-outline"
              >
                বিস্তারিত
              </Link>

              <Link
                href={route('admin.updateProductCustomerRenderPage', {
                  purchase_id: item?.id,
                })}
                className="btn btn-xs btn-outline"
              >
                আপডেট করুন
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResponsiveCustomerDetailsTable;
