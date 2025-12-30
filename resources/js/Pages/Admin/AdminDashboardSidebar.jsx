import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

function AdminDashboardSidebar() {
  const handleLogout = () => {
    Swal.fire({
      title: 'আপনি কি আসলেই লগআউট করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, লগআউট করুন!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('logout'), {
          replace: true,
        });
      }
    });
  };
  return (
    <div className="drawer-side">
      <label
        htmlFor="admin-dashboard-sidebar"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu bg-base-200 min-h-full w-80 p-4 flex flex-col gap-4">
        {/* Sidebar content here */}
        <li>
          <Link href={route('admin.showAllUsers')}> এমপ্লয়ী ম্যানেজমেন্ট </Link>
        </li>
        <li>
          <Link href={route('password.update.form')}>
            {' '}
            পাসওয়ার্ড আপডেট করুন{' '}
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="btn btn-xs btn-neutral">
            {' '}
            লগআউট করুন{' '}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboardSidebar;
