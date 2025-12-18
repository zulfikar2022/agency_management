import { Link } from '@inertiajs/react';

function EmployeeMemberResponsiveTable({ members }) {
  return (
    <div>
      {members.length === 0 ? (
        <p className="text-center mt-4">কোনো সদস্য পাওয়া যায়নি।</p>
      ) : (
        members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-1 md:grid-cols-15 gap-4 p-4 border-b items-center"
          >
            {/* ID - Occupies 1 out of 12 columns (very small) */}
            <div className="md:col-span-1">
              <p className=" font-bold">আইডি</p>
              <p className="">{member?.id}</p>
            </div>

            {/* Name - Occupies 4 out of 12 columns */}
            <div className="md:col-span-4">
              <p className=" font-bold">নাম</p>
              <p className="">{member?.name}</p>
            </div>

            {/* Address  */}
            <div className="md:col-span-3">
              <p className=" font-bold">ঠিকানা</p>
              <p className="">{member?.address}</p>
            </div>
            {/* Phone Number - Occupies 3 out of 12 columns */}
            <div className="md:col-span-3">
              <p className=" font-bold">ফোন নম্বর</p>
              <p className="">{member?.phone_number}</p>
            </div>

            {/* Actions - Occupies 4 out of 12 columns */}
            <div className="md:col-span-4 flex flex-col md:flex-row gap-2">
              <Link className="btn btn-outline btn-xs">বিস্তারিত দেখুন</Link>
              {member?.deposit_account && (
                <Link
                  href={route('employee.bank.collect_deposit', {
                    member: member.id,
                  })}
                  className="btn btn-neutral btn-xs"
                >
                  সঞ্চয় জমা
                </Link>
              )}
              {member?.total_loan > 0 && (
                <Link className="btn btn-outline btn-xs">কিস্তি উত্তোলন</Link>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeMemberResponsiveTable;
