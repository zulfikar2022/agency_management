import { Head, Link, router } from '@inertiajs/react';
import AdminDashboardLayout from '../../AdminDashboardLayout';
import { Delete, DeleteIcon, LucideDelete } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function DEAllMembers({ members, dataEntryMode = false }) {
  // admin.bank.de.member_details
  const handleDeleteMember = (member) => {
    Swal.fire({
      text: `আপনি কি নিশ্চিত যে আপনি মেম্বার আইডি ${member.id}, যার নাম ${member.name} ডিলিট করতে চান? এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.bank.de.delete_member', member.id), {
          preserveScroll: true,
          onError: (err) => {
            toast.error(err?.message || 'সদস্য মুছে ফেলা ব্যর্থ হয়েছে।', {
              theme: 'dark',
              position: 'top-center',
            });
          },
          onSuccess: () => {
            toast.success('সদস্য সফলভাবে মুছে ফেলা হয়েছে!', {
              theme: 'dark',
              position: 'top-center',
            });
          },
        });
      }
    });
  };
  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
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
                className="border-b py-2 grid grid-cols-1 md:grid-cols-13"
              >
                <p
                  onClick={() => handleDeleteMember(member)}
                  className="col-span-1 border mr-2 ps-2 rounded-lg bg-red-100 hover:cursor-pointer hover:bg-red-400 transition duration-300 text-center"
                >
                  <LucideDelete className="text-red-700" />
                </p>
                <div className="col-span-3">
                  <p>
                    <span className="font-bold">মেম্বার আইডি:</span> {member.id}
                  </p>
                </div>
                <div className="col-span-3">
                  <p>
                    {' '}
                    <span className="font-bold">নাম:</span> {member.name}
                  </p>
                </div>
                <div className="col-span-3">
                  <p>
                    {' '}
                    <span className="font-bold">মোট সঞ্চয়:</span>{' '}
                    {(member.total_deposit / 100).toFixed(2)} টাকা
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-2 col-span-3">
                  {/* admin.bank.de.collect_deposit */}
                  <Link
                    href={route('admin.bank.de.collect_deposit', member.id)}
                    className="btn btn-xs btn-success"
                  >
                    সঞ্চয় সংগ্রহ করুন
                  </Link>
                  <Link
                    href={route('admin.bank.de.provide_loan', member.id)}
                    className="btn btn-xs btn-error"
                  >
                    ঋণ প্রদান করুন
                  </Link>
                  <Link
                    href={route('admin.bank.de.collect_loan', member.id)}
                    className="btn btn-xs btn-primary"
                  >
                    কিস্তি গ্রহণ করুন
                  </Link>
                  <Link
                    className="underline"
                    href={route('admin.bank.de.member_details', member.id)}
                  >
                    বিস্তারিত
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
