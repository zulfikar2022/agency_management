import { Link } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';

function EmployeeBankLayout({ children }) {
  return (
    <div>
      <ToastContainer />
      <div className="navbar">
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-xl"
            >
              <li>
                <Link
                  className="text-sm"
                  //   href={route('employee.bank.members', {
                  //     today: new Date()
                  //       .toLocaleDateString(undefined, { weekday: 'long' })
                  //       .toLowerCase(),
                  //   })}
                  href={route('employee.bank.members')}
                >
                  সকল সদস্য
                </Link>
              </li>
              <li>
                <Link
                  href={route('employee.bank.not_deposited_today')}
                  className="text-sm"
                >
                  আজ যারা সঞ্চয় দেয়নি
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm"
                  href={route('employee.bank.not_installment_today')}
                >
                  আজ যারা ঋণের কিস্তি দেয়নি
                </Link>
              </li>
            </ul>
          </div>
          {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-xl">
            <li>
              <Link className="text-sm" href={route('employee.bank.members')}>
                সকল সদস্য
              </Link>
            </li>
            <li>
              <Link
                href={route('employee.bank.not_deposited_today')}
                className="text-sm"
              >
                আজ যারা সঞ্চয় দেয়নি
              </Link>
            </li>
            <li>
              <Link
                className="text-sm"
                href={route('employee.bank.not_installment_today')}
              >
                আজ যারা ঋণের কিস্তি দেয়নি
              </Link>
            </li>
          </ul>
        </div>
        <div className="drawer drawer-end navbar-end">
          <Link href={route('employee.dashboard')} className="btn btn-neutral">
            ড্যাশবোর্ডে যান
          </Link>
        </div>
      </div>
      <div className="">{children}</div>
    </div>
  );
}

export default EmployeeBankLayout;
