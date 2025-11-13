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
          <Link href={route('admin.showProducts')}>সকল পণ্য দেখুন</Link>
        </li>
        <li>
          <Link href={route('admin.createProduct')}>নতুন পণ্য তৈরি করুন</Link>
        </li>
        <li>
          <Link href={route('admin.showAvailableProducts')}>
            উপলব্ধ পণ্যসমূহ
          </Link>
        </li>

        <li>
          <Link href={route('admin.showUnavailableProducts')}>
            অপ্রাপ্য পণ্যসমূহ
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProductOpenDrawer;
