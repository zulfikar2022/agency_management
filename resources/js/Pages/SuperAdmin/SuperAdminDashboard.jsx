import { Link, router } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

function SuperAdminDashboard({ children }) {
  const handleLogout = () => {
    Swal.fire({
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('logout'));
      }
    });
  };
  return (
    <div>
      <ToastContainer />
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href={route('superadmin.home')}>All members </Link>
              </li>

              <li>
                <Link href={route('superadmin.allDeletedUsers')}>
                  All Deleted Members
                </Link>
              </li>
              <li>
                <Link>Register A Member</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href={route('superadmin.home')}>All members </Link>
            </li>
            <li>
              <Link href={route('superadmin.allDeletedUsers')}>
                All Deleted members{' '}
              </Link>
            </li>

            <li>
              <Link>Register A Member</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {/* <Link href={route('logout')} method="post" className="btn">
            Logout
          </Link> */}
          <p className="btn btn-xs btn-neutral" onClick={() => handleLogout()}>
            Logout
          </p>
        </div>
      </div>
      <div className="container mx-auto my-5">{children}</div>
    </div>
  );
}

export default SuperAdminDashboard;
