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
        </li>
      </ul>
    </div>
  );
}

export default MoneyOpenDrawer;
