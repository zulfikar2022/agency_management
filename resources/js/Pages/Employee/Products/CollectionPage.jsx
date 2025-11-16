import EmployeeProductLayout from '../layouts/EmployeeProductLayout';

function CollectionPage({ user, customer, purchases }) {
  console.log(purchases);
  return (
    <EmployeeProductLayout>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">কাস্টমার কালেকশন পেজ</h1>
        <p>
          <span className="font-semibold">কাস্টমার নাম:</span> {customer?.name}
        </p>

        <p>
          <span className="font-semibold">কাস্টমার ফোন:</span>{' '}
          {customer?.phone_number}
        </p>
        {/* আরও কাস্টমার সম্পর্কিত তথ্য এখানে দেখানো যেতে পারে */}
      </div>
    </EmployeeProductLayout>
  );
}

export default CollectionPage;
