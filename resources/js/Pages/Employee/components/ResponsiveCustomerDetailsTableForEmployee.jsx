import { Link } from '@inertiajs/react';

function ResponsiveCustomerDetailsTableForEmployee({ purchagedProducts }) {
  return (
    <div className="mt-10 mb-5">
      {purchagedProducts.length === 0 && (
        <p className="text-center font-semibold">কোনো পণ্য ক্রয় করা হয়নি।</p>
      )}
      {purchagedProducts.length > 0 && (
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold">ক্রয়কৃত পণ্যের তালিকা</h2>
        </div>
      )}
      {purchagedProducts?.map((item, index) => {
        return (
          <div
            key={item?.id}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-b px-5 py-2 container mx-auto"
          >
            <div className="">
              <p className="font-bold">পণ্যের নামঃ </p>
              <p>{item?.product?.name}</p>
            </div>
            <div className="">
              <p className="font-bold">ক্রয়কৃত পরিমাণঃ</p>
              <p>{item?.quantity} টি </p>
            </div>
            <div className="">
              <p className="font-bold">মোট মূল্যঃ </p>
              <p>{item?.total_payable_price} টাকা </p>
            </div>
            <div className="">
              <p className="font-bold">বাকি আছেঃ </p>
              <p>{item?.remaining_payable_price} টাকা </p>
            </div>
            {/* <div>
              <Link
                // href={route('admin.showCustomerPurchaseDetails', {
                //   customer_id: item?.customer_id,
                //   purchase_id: item?.id,
                // })}
                className="btn btn-xs btn-outline"
              >
                বিস্তারিত
              </Link>
            </div> */}
          </div>
        );
      })}
    </div>
  );
}

export default ResponsiveCustomerDetailsTableForEmployee;
