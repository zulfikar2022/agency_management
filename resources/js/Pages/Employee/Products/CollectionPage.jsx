import CollectMoneyForm from '../components/CollectMoneyForm';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';

function CollectionPage({ user, customer, purchases }) {
  console.log(customer);
  return (
    <EmployeeProductLayout>
      <div className="p-5">
        <div className="flex flex-col gap-3 mb-6 container mx-auto items-center">
          <h1 className="text-2xl font-bold mb-4">কাস্টমার কালেকশন পেজ</h1>
          <p>
            <span className="font-semibold">কাস্টমার নাম:</span>{' '}
            {customer?.name}
          </p>

          <p>
            <span className="font-semibold">কাস্টমার ফোন:</span>{' '}
            {customer?.phone_number}
          </p>
        </div>
        {/* আরও কাস্টমার সম্পর্কিত তথ্য এখানে দেখানো যেতে পারে */}
        <CollectMoneyForm
          customer_id={customer?.id}
          product_name={purchases[0]?.product?.name}
          collectable_amount={100}
        />
      </div>
    </EmployeeProductLayout>
  );
}

export default CollectionPage;
