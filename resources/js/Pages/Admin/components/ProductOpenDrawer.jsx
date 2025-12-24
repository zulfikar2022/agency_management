import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';

function ProductOpenDrawer() {
  return (
    <div className="drawer-side">
      <label
        htmlFor="product-drawer-control"
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
        </li>
        <li>
          <p className="hover:bg-white hover:cursor-auto font-bold underline">
            {' '}
            পণ্য নিয়ন্ত্রণ
          </p>
        </li>
        <li>
          <Link className="ml-3" href={route('admin.showProducts')}>
            সকল পণ্য দেখুন
          </Link>
        </li>
        <li>
          <Link className="ml-3" href={route('admin.createProduct')}>
            নতুন পণ্য যুক্ত করুন
          </Link>
        </li>
        <li>
          <Link className="ml-3" href={route('admin.showAvailableProducts')}>
            এভেইলেবল পণ্যসমূহ
          </Link>
        </li>

        <li>
          <Link className="ml-3" href={route('admin.showUnavailableProducts')}>
            আনএভেইলেবল পণ্যসমূহ
          </Link>
        </li>
        <li>
          <p className="hover:bg-white hover:cursor-auto font-bold underline">
            {' '}
            কাস্টমার নিয়ন্ত্রণ
          </p>
        </li>
        <li>
          <Link className="ml-3" href={route('admin.showCustomers')}>
            সকল কাস্টমার দেখুন
          </Link>
        </li>
        <li>
          <Link className="ml-3" href={route('admin.createCustomer')}>
            কাস্টমার যুক্ত করুন
          </Link>
        </li>

        {/* features from employee for watching collections */}
        <li>
          <Link
            href={route('admin.haveToPayToday', {
              today: dayjs().format('dddd'),
            })}
            className="ml-3"
          >
            আজ যারা টাকা দেবে
          </Link>
        </li>

        <li>
          <Link
            href={route('admin.customerHaveToPayToday', {
              todate: dayjs().format('YYYY-MM-DD'),
            })}
            className="ml-3"
          >
            আজ যারা টাকা দিয়েছে
          </Link>
        </li>
        <li>
          <Link
            href={route('admin.customersDidNotPayToday', {
              todate: dayjs().format('YYYY-MM-DD'),
              today: dayjs().format('dddd'),
            })}
            className="ml-3"
          >
            আজ যারা টাকা দেয়নি
          </Link>
        </li>

        <li>
          <Link
            href={route('admin.todaysCollections', {
              todate: dayjs().format('YYYY-MM-DD'),
            })}
            className="ml-3"
          >
            আজকের কালেকশন
          </Link>
        </li>
        <li>
          <Link
            href={route('admin.employeeWiseProductReportsPage')}
            className="ml-3 underline text-blue-500 mb-2 block"
          >
            এমপ্লয়ী অনুযায়ী সংগ্রহ রিপোর্ট
          </Link>
        </li>
        <li>
          <p className="hover:bg-white hover:cursor-auto font-bold underline">
            {' '}
            ইউজার নিয়ন্ত্রণ
          </p>
        </li>
        <li>
          <Link href={route('admin.showAllUsers')} className="ml-3">
            সকল ইউজার দেখুন
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProductOpenDrawer;
