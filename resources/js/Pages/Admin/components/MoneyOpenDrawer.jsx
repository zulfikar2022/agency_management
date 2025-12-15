import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';

function MoneyOpenDrawer() {
  return (
    <div className="drawer-side">
      <label
        htmlFor="money-drawer-control"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu bg-base-200 min-h-full w-80 p-4">
        {/* Sidebar content here */}
        <li>
          <Link
            href={route('admin.dashboard')}
            className="ml-3 btn btn-xs btn-neutral mb-4"
          >
            ড্যাশবোর্ডে যান
          </Link>

          <Link href={route('admin.bank.members')} className="ml-3">
            সকল সদস্য দেখুন
          </Link>
          <Link href={route('admin.bank.add_new_member')} className="ml-3">
            নতুন সদস্য যুক্ত করুন
          </Link>
          <p className="font-bold underline">সঞ্চয়ী ও ঋণী সদস্য</p>
          <Link
            href={route('admin.bank.all_depositing_members')}
            className="ml-3"
          >
            সকল সঞ্চয়ী সদস্য দেখুন
          </Link>
          <Link href={route('admin.bank.all_loan_members')} className="ml-3">
            সকল ঋণী সদস্য দেখুন
          </Link>
          <p className="font-bold underline">জমা করেছে </p>
          <Link href={route('admin.bank.deposited_today')} className="ml-3">
            আজ যারা সঞ্চয় জমা করেছে
          </Link>
          <Link
            href={route('admin.bank.provided_installment_today')}
            className="ml-3"
          >
            আজ যারা ঋণের কিস্তি দিয়েছে
          </Link>
          <p className="font-bold underline">জমা করেনি </p>
          <Link href={route('admin.bank.not_deposited_today')} className="ml-3">
            আজ যারা সঞ্চয় দেয়নি
          </Link>
          <Link
            href={route('admin.bank.not_installmented_today')}
            className="ml-3"
          >
            আজ যারা ঋণের কিস্তি দেয়নি
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default MoneyOpenDrawer;
