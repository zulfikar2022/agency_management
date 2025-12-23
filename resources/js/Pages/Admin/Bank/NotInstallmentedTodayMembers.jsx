import { useState } from 'react';
import LayoutForMoney from '../layouts/LayoutForMoney';
import { Link } from '@inertiajs/react';
import MemberTable from './components/MemberTable';
import Pagination from '../components/Pagination';

function NotInstallmentedTodayMembers({ data }) {
  const members = data?.data;
  const paginate = { ...data, data: [] };
  const [searchTerm, setSearchTerm] = useState('');

  console.log(members);
  return (
    <LayoutForMoney>
      <div className="container mx-auto">
        <h2 className="font-bold text-3xl text-center my-4">
          {' '}
          আজ ঋণের কিস্তি দেয়নি এমন সদস্যগণ দেখুন{' '}
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
            href={route('admin.bank.not_installmented_today', {
              search: searchTerm,
            })}
            className="btn btn-neutral w-[150px]"
          >
            অনুসন্ধান করুন
          </Link>
        </div>
        <div className="container mx-auto">
          <MemberTable members={members} />
          <Pagination paginationData={paginate} />
        </div>
      </div>
    </LayoutForMoney>
  );
}

export default NotInstallmentedTodayMembers;
