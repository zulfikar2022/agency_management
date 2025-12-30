import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

function EmployeeDashboardLayout({ children }) {
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
    <div>
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
                <Link
                  className="text-xl"
                  href={route('employee.customersThatPayToday', {
                    today: new Date()
                      .toLocaleDateString(undefined, { weekday: 'long' })
                      .toLowerCase(),
                  })}
                >
                  পণ্যের কালেকশন
                </Link>
              </li>
              <li>
                <Link href={route('employee.bank.members')} className="text-xl">
                  সঞ্চয় ও ঋণের কালেকশন
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                className="text-xl"
                href={route('employee.customersThatPayToday', {
                  today: new Date()
                    .toLocaleDateString(undefined, { weekday: 'long' })
                    .toLowerCase(),
                })}
              >
                পণ্যের কালেকশন
              </Link>
            </li>
            <li>
              <Link href={route('employee.bank.members')} className="text-xl">
                সঞ্চয় ও ঋণের কালেকশন
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link
            className="pr-3 underline text-blue-600"
            href={route('password.update.form')}
          >
            পাসওয়ার্ড পরিবর্তন
          </Link>
          <button onClick={handleLogout} className="btn btn-xs btn-neutral">
            লগআউট করুন
          </button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default EmployeeDashboardLayout;
