import { Link } from '@inertiajs/react';

function EmployeeProductLayout({ children }) {
  return (
    <div>
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
                  href={route('employee.customersThatPayToday', {
                    today: new Date()
                      .toLocaleDateString(undefined, { weekday: 'long' })
                      .toLowerCase(),
                  })}
                >
                  আজ যারা টাকা দেবে
                </Link>
              </li>
              <li>
                <Link href={route('employee.allCustomers')} className="text-sm">
                  সকল কাস্টমার{' '}
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm"
                  href={route('employee.customersPaidToday', {
                    todate: new Date().toISOString().split('T')[0],
                  })}
                >
                  আজ যারা টাকা দিয়েছে{' '}
                </Link>
              </li>
              <li>
                <Link
                  href={route('employee.customersWhoDidntPayToday', {
                    todate: new Date().toISOString().split('T')[0],
                    today: new Date()
                      .toLocaleDateString(undefined, { weekday: 'long' })
                      .toLowerCase(),
                  })}
                  className="text-sm"
                >
                  আজ যারা টাকা দেয়নি
                </Link>
              </li>
              <li>
                <Link
                  href={route('employee.todaysCollection', {
                    todate: new Date().toISOString().split('T')[0],
                  })}
                  className="text-sm"
                >
                  আজকের কালেকশন{' '}
                </Link>
              </li>
              <li>
                <Link
                  href={route('employee.todaysStatus', {
                    todate: new Date().toISOString().split('T')[0],
                  })}
                  className="text-sm"
                >
                  আজকের স্ট্যাটাস{' '}
                </Link>
              </li>
              {/* <li>
                <Link>ড্যাশবোর্ডে যান </Link>
              </li> */}
            </ul>
          </div>
          {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-xl">
            <li>
              <Link
                className="text-sm"
                href={route('employee.customersThatPayToday', {
                  today: new Date()
                    .toLocaleDateString(undefined, { weekday: 'long' })
                    .toLowerCase(),
                })}
              >
                আজ যারা টাকা দেবে
              </Link>
            </li>
            <li>
              <Link href={route('employee.allCustomers')} className="text-sm">
                সকল কাস্টমার{' '}
              </Link>
            </li>
            <li>
              <Link
                className="text-sm"
                href={route('employee.customersPaidToday', {
                  todate: new Date().toISOString().split('T')[0],
                })}
              >
                আজ যারা টাকা দিয়েছে{' '}
              </Link>
            </li>
            <li>
              <Link
                href={route('employee.customersWhoDidntPayToday', {
                  todate: new Date().toISOString().split('T')[0],
                  today: new Date()
                    .toLocaleDateString(undefined, { weekday: 'long' })
                    .toLowerCase(),
                })}
                className="text-sm"
              >
                আজ যারা টাকা দেয়নি{' '}
              </Link>
            </li>
            <li>
              <Link
                href={route('employee.todaysCollection', {
                  todate: new Date().toISOString().split('T')[0],
                })}
                className="text-sm"
              >
                আজকের কালেকশন{' '}
              </Link>
            </li>
            <li>
              <Link
                href={route('employee.todaysStatus', {
                  todate: new Date().toISOString().split('T')[0],
                })}
                className="text-sm"
              >
                আজকের স্ট্যাটাস{' '}
              </Link>
            </li>
            {/* <li>
              <Link className="text-sm">ড্যাশবোর্ডে যান </Link>
            </li> */}
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

export default EmployeeProductLayout;
