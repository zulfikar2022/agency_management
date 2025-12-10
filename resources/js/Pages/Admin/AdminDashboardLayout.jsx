import { Link, router } from '@inertiajs/react';
import { NavigationBar } from './components/NavigationBar';
import Swal from 'sweetalert2';

function AdminDashboardLayout({ children }) {
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
    <div className="admin-dashboard-layout h-full min-h-screen">
      <header className="admin-dashboard-header">
        <div className="navbar bg-slate-100 shadow-sm">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {' '}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />{' '}
                </svg>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-xl"
              >
                <li>
                  <Link href={route('admin.showProducts')}>পণ্য</Link>
                </li>
                <li>
                  <Link href={route('admin.bank.members')}>সঞ্চয় ও ঋণ </Link>
                </li>
              </ul>
            </div>
            {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-xl">
              <li>
                <Link href={route('admin.showProducts')}>পণ্য</Link>
              </li>
              <li>
                <Link href={route('admin.bank.members')}>সঞ্চয় ও ঋণ </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <button onClick={handleLogout} className="btn btn-sm btn-neutral">
              লগআউট করুন
            </button>
          </div>
        </div>
      </header>
      <main className="admin-dashboard-content h-full">{children}</main>
    </div>
  );
}

export default AdminDashboardLayout;
