import { Link } from '@inertiajs/react';
import AdminDashboardLayout from '../../AdminDashboardLayout';
import { ArrowLeft, Pencil, ReceiptRussianRuble } from 'lucide-react';
import { dateFormatter } from '@/utilityFuntion';

function DEMemberDetails({
  member,
  dataEntryMode = false,
  deposit,
  loan,
  deposit_collections,
  loan_collections,
}) {
  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <div className="container mx-auto px-4">
        <div className="mb-4 mt-3">
          <Link
            href={route('admin.bank.de.all_members')}
            className="text-blue-700 underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} /> ফিরে যান
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-start md:justify-items-center">
          <div>
            <p className="font-bold text-2xl underline mb-5">সঞ্চয়</p>
            <div className="space-y-2">
              {deposit_collections.map((collection) => {
                return (
                  <div
                    key={collection.id}
                    className="flex gap-2 items-center border-b"
                  >
                    <div>
                      <p className="font-bold">পরিমাণঃ </p>
                      <span>
                        {(collection?.deposit_amount / 100).toFixed(2)} টাকা
                      </span>
                    </div>
                    {/* admin.bank.de.update_deposit_collection */}
                    <Link
                      href={route('admin.bank.de.update_deposit_collection', {
                        deposit_collection: collection.id,
                      })}
                    >
                      <Pencil className="text-blue-600 hover:cursor-pointer" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p className="font-bold text-2xl underline mb-5">ঋণ</p>
            <div className="flex gap-2 items-center border-b">
              <div>
                <p>
                  <span className="font-bold">লোনের পরিমাণঃ</span>{' '}
                  {(loan?.total_loan / 100).toFixed(2)} টাকা{' '}
                </p>
                <p>
                  <span className="font-bold">লোন প্রদানের তারিখঃ</span>{' '}
                  {dateFormatter(loan?.created_at)}{' '}
                </p>
              </div>
              <Pencil className="text-blue-600 hover:cursor-pointer" />
            </div>
          </div>
          <div>
            <p className="font-bold text-2xl underline mb-5">কিস্তি</p>
            <div className="space-y-2">
              {loan_collections.map((collection) => {
                return (
                  <div
                    key={collection.id}
                    className="flex gap-2 items-center border-b"
                  >
                    <div>
                      <p className="font-bold">পরিমাণঃ </p>
                      <span>
                        {(collection?.paid_amount / 100).toFixed(2)} টাকা
                      </span>
                    </div>
                    <Link
                      href={route('admin.bank.de.update_loan_collection', {
                        loan_collection: collection.id,
                      })}
                    >
                      <Pencil className="text-blue-600 hover:cursor-pointer" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default DEMemberDetails;
