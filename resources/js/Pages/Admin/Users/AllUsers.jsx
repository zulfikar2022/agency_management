import { Link, router } from '@inertiajs/react';
import LayoutForProduct from '../layouts/LayoutForProduct';
import Swal from 'sweetalert2';
import AdminDashboardLayout from '../AdminDashboardLayout';
import { ArrowLeft } from 'lucide-react';

function AllUsers({ users }) {
  console.log(users);
  const admins = users.filter(
    (user) => user?.is_admin === 1 && user?.is_employee === 0
  );
  const employees = users.filter(
    (user) => user?.is_employee === 1 && user?.is_admin === 0
  );
  const noPowerUsers = users.filter(
    (user) => user?.is_employee === 0 && user?.is_admin === 0
  );
  const handlePowerToggleEmployee = (employee) => {
    console.log(employee);
    Swal.fire({
      text: employee.is_activated
        ? `আপনি কি আসলেই এমপ্লয়ীর (${employee?.name}) ক্ষমতা বন্ধ করতে চান?`
        : `আপনি কি আসলেই এমপ্লয়ীর (${employee?.name}) ক্ষমতা পুনর্বহাল করতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, করতে চাই!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(
          route('admin.toggleEmployeePower', { user_id: employee.id })
        );
      }
    });
  };
  return (
    <AdminDashboardLayout>
      <div>
        <div className="pl-10 mt-4">
          <Link href={route('home')} className="text-blue-700 underline ">
            {' '}
            <span className="flex">
              <ArrowLeft /> <span>ফিরে যান</span>
            </span>{' '}
          </Link>
        </div>{' '}
        <h1 className="text-2xl font-bold mb-4 text-center md:container mx-2 md:mx-auto pb-2 my-5">
          সকল ইউজারের তালিকা
        </h1>
        <div className="md:container mx-2 md:mx-auto">
          <h2 className="text-xl font-semibold mb-2">অ্যাডমিন ইউজারগণ</h2>
          <ul className="list-disc list-inside mb-6">
            {admins.map((admin) => (
              <div key={admin.id} className="border-b p-2">
                <div>
                  <span>{admin.name}</span> &nbsp; - &nbsp;{' '}
                  <span>{admin.email}</span>
                </div>
              </div>
            ))}
          </ul>
        </div>
        <div className="md:container md:mx-auto mx-2">
          <h2 className="text-xl font-semibold mb-2">এমপ্লয়ি ইউজারগণ</h2>
          <ul className="list-disc list-inside mb-6">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className={`border-b p-2 flex  flex-col md:flex-row md:justify-between ${employee.is_activated ? '' : 'bg-red-200'}`}
              >
                <div>
                  <span>{employee.name}</span> &nbsp; - &nbsp;{' '}
                  <span>{employee.email}</span>
                </div>
                {employee.is_activated && (
                  <button
                    onClick={() => handlePowerToggleEmployee(employee)}
                    className="btn btn-xs btn-error"
                  >
                    এমপ্লয়ী ক্ষমতা স্থগিত করুন
                  </button>
                )}
                {employee.is_activated === 0 && (
                  <>
                    <button
                      className={`btn btn-xs btn-success`}
                      onClick={() => handlePowerToggleEmployee(employee)}
                    >
                      {''}এমপ্লয়ী ক্ষমতা পূনর্বহাল করুন
                    </button>
                  </>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default AllUsers;
