import { Link } from '@inertiajs/react';

function EmployeeDashboardLayout({ children }) {
  return (
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
              <Link className="text-xl" href="#">
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
            <Link href={'#'} className="text-xl">
              সঞ্চয় ও ঋণের কালেকশন
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">{/* <a className="btn">Button</a> */}</div>
    </div>
  );
}

export default EmployeeDashboardLayout;
