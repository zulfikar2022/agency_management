import { Link } from '@inertiajs/react';

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
            অপ্রাপ্য পণ্যসমূহ
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
      </ul>
    </div>
  );
}

export default ProductOpenDrawer;
