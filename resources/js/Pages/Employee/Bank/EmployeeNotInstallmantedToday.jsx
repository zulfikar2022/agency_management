import { useState } from 'react';
import EmployeeBankLayout from '../layouts/EmployeeBankLayout';
import { Link } from '@inertiajs/react';
import EmployeeMemberResponsiveTable from '../components/EmployeeMemberResponsiveTable';
import Pagination from '@/Pages/Admin/components/Pagination';

function EmployeeNotInstallmantedToday({ members }) {
  console.log(members);
  const pagination = { ...members, data: [] };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <EmployeeBankLayout>
      <div className="container mx-2  md:mx-auto ">
        <h2 className="font-bold text-2xl text-center">
          আজ যারা ঋণের কিস্তি দেয়নি
        </h2>
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
            href={route('employee.bank.not_installment_today', {
              search: searchTerm,
            })}
            className="btn btn-neutral w-[150px]"
          >
            অনুসন্ধান করুন
          </Link>
        </div>
        <EmployeeMemberResponsiveTable members={members.data} />
        <Pagination
          paginationData={pagination}
          queryParams={{ search: searchTerm }}
        />
      </div>
    </EmployeeBankLayout>
  );
}

export default EmployeeNotInstallmantedToday;
