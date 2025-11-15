import { Link } from '@inertiajs/react';

function BoughtList({ purchagedProducts }) {
  return (
    <div>
      <div className="mx-10 md:mx-5 mt-10">
        {purchagedProducts?.length > 0 && (
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>পণ্যের নাম</th>
                <th>ক্রয় কৃত পরিমাণ</th>
                <th>মোট মূল্য</th>
                <th>বাকি আছে</th>
                <th>একশন</th>
              </tr>
            </thead>
            <tbody>
              {purchagedProducts.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{item?.product?.name}</td>
                    <td>{item?.quantity}</td>
                    <td>{item?.total_payable_price}</td>

                    <td>{item?.remaining_payable_price}</td>
                    <td>
                      <Link
                        href={route('admin.showCustomerPurchaseDetails', {
                          customer_id: item?.customer_id,
                          purchase_id: item?.id,
                        })}
                        className="btn btn-xs btn-outline"
                      >
                        <span className="">বিস্তারিত</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BoughtList;
