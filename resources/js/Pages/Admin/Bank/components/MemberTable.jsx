import { Link } from '@inertiajs/react';

function MemberTable({ members }) {
  console.log(members);
  return (
    <div>
      {members.map((member) => (
        <div
          key={member?.id}
          className="border-b border-black py-2 grid grid-cols-1 md:grid-cols-6 gap-4 mb-4  items-center mx-5 md:mx-0"
        >
          <div className="flex flex-col">
            <p className="font-bold">আইডি</p>
            <p>{member?.id}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">নাম</p>
            <p>{member?.name}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">ঠিকানা</p>
            <p>{member?.address}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">মোট সঞ্চয়</p>
            <p>{(member?.total_deposit / 100).toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">মোট লোন</p>
            <p>{(member?.total_loan / 100).toFixed(2)}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Link
              href={route('admin.bank.member_details', member.id)}
              className="btn btn-xs btn-outline w-full mr-0 md:w-auto"
            >
              বিস্তারিত দেখুন
            </Link>
            <Link
              href={route('admin.bank.edit_member', member.id)}
              className="btn btn-xs btn-neutral w-full md:w-auto"
            >
              আপডেট করুন
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemberTable;
