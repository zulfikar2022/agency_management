import { useState } from 'react';
import EmployeeMemberResponsiveTable from '../components/EmployeeMemberResponsiveTable';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';
import { Link } from '@inertiajs/react';
import Pagination from '@/Pages/Admin/components/Pagination';

function EmployeeAllMembers({ members, totalMembers }) {
  const pagination = { ...members, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <EmployeeBankLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">সকল সদস্য</h1>
        {members?.data?.length >= 0 && (
          <div className="flex flex-col md:flex-row mb-4 mr-3 md:mr-0 px-2">
            <input
              type="text"
              placeholder="সদস্য অনুসন্ধান করুন..."
              className="input input-bordered w-full max-w-xs mr-2 mb-2 md:mb-0"
              value={searchTerm}
              name="search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Link
              href={route('employee.bank.members', { search: searchTerm })}
              className="btn btn-neutral w-[150px]"
            >
              অনুসন্ধান করুন
            </Link>
          </div>
        )}
        <EmployeeMemberResponsiveTable members={members.data} />
        <Pagination
          paginationData={pagination}
          queryParams={{ search: searchTerm }}
        />
      </div>
    </EmployeeBankLayout>
  );
}

export default EmployeeAllMembers;
