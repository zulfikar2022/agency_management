import LayoutForProduct from '../layouts/LayoutForProduct';

function ShowCustomerPurchaseDetails({ customer, purchase }) {
  console.log({ purchase, customer });
  return (
    <LayoutForProduct>
      <div className="container mx-auto p-4 flex flex-col gap-4 md:flex-row md:justify-between border-b mb-5">
        <div>
          <h1>
            <span className="underline">ক্রেতার নামঃ</span> &nbsp;{' '}
            {customer.name}
          </h1>

          <p>
            <span className="underline">পণ্যের নামঃ</span> &nbsp;
            {purchase?.product?.name}
          </p>
          <p>
            <span className="underline">পরিমাণঃ</span> &nbsp;
            {purchase?.quantity}টি
          </p>
          <p>
            <span className="underline">ক্রয়ের তারিখঃ</span> &nbsp;
            {new Date(purchase?.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p>মোট মূল্যঃ {purchase?.total_payable_price} টাকা</p>
          <p>ডাউনপেমেন্টঃ {purchase?.downpayment} টাকা</p>
          <p>কিস্তিতে পরিশোধ হয়েছেঃ </p>
          <p>বাকি আছেঃ {purchase?.remaining_payable_price} টাকা</p>
        </div>
      </div>
      <div>
        <h1 className="text-lg font-bold text-center"> টাকা কালেকশন তালিকা</h1>
      </div>
    </LayoutForProduct>
  );
}

export default ShowCustomerPurchaseDetails;
