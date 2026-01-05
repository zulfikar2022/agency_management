import { Head, Link } from '@inertiajs/react';
import AdminDashboardLayout from '../../AdminDashboardLayout';

function DEAllMembers({ members }) {
  return (
    <AdminDashboardLayout>
      <Head title="সকল সদস্য" />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">সকল সদস্য</h1>
        {members?.length === 0 && (
          <p className="mt-4 text-center">কোনো সদস্য পাওয়া যায়নি।</p>
        )}
        {members?.length > 0 &&
          members.map((member) => {
            return (
              <div
                key={member.id}
                className="border-b py-2 grid grid-cols-1 md:grid-cols-3"
              >
                <p>
                  <span className="font-bold">Member ID:</span> {member.id}
                </p>
                <p>
                  {' '}
                  <span className="font-bold">Name:</span> {member.name}
                </p>
                <div className="flex flex-col md:flex-row gap-2">
                  <Link
                    href={route('admin.bank.de.provide_loan', member.id)}
                    className="btn btn-xs btn-error"
                  >
                    ঋণ প্রদান করুন
                  </Link>
                  <Link className="btn btn-xs btn-primary">
                    কিস্তি গ্রহণ করুন
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </AdminDashboardLayout>
  );
}

export default DEAllMembers;
