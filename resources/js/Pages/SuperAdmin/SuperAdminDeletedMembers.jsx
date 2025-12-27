import { ToggleLeft } from 'lucide-react';
import SuperAdminDashboard from './SuperAdminDashboard';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';
import { router } from '@inertiajs/react';

function SuperAdminDeletedMembers({ users }) {
  const handleRestoreUser = (user) => {
    Swal.fire({
      text:
        'Are you sure you want to restore this user with name ' +
        user.name +
        '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('superadmin.toggleDeleteStatus', { user: user.id }), {
          onSuccess: () => {
            toast.success('User restored successfully!', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
              transition: Bounce,
            });
          },
        });
      }
    });
  };
  const activationToggler = (user) => {
    Swal.fire({
      text:
        'Are you sure you want to toggle the activation status of this user with name ' +
        user.name +
        '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(
          route('superadmin.toggleActivationStatus', { user: user.id }),
          {
            onSuccess: () => {
              toast.success('User activation status toggled successfully!', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
              });
            },
            onError: (error) => {
              toast.error(error?.error || 'An error occurred.', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
              });
            },
          }
        );
      }
    });
  };

  const toggleAdminStatus = (user) => {
    Swal.fire({
      text:
        'Are you sure you want to toggle the admin status of this user with name ' +
        user.name +
        '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('superadmin.toggleAdminStatus', { user: user.id }), {
          onSuccess: () => {
            toast.success('User admin status toggled successfully!', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
              transition: Bounce,
            });
          },
          onError: (error) => {
            toast.error(error?.error || 'An error occurred.', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
              transition: Bounce,
            });
          },
        });
      }
    });
  };

  const toggleEmployeeStatus = (user) => {
    Swal.fire({
      text:
        'Are you sure you want to toggle the employee status of this user with name ' +
        user.name +
        '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(
          route('superadmin.toggleEmployeeStatus', { user: user.id }),
          {
            onSuccess: () => {
              toast.success('User employee status toggled successfully!', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
              });
            },
            onError: (error) => {
              toast.error(error?.error || 'An error occurred.', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
              });
            },
          }
        );
      }
    });
  };

  return (
    <SuperAdminDashboard>
      <h1 className="font-bold text-2xl text-center my-4 text-red-500">
        All Deleted Members
      </h1>
      {users?.length === 0 && <p className="text-center">No members found.</p>}
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-4 mb-4 border border-red-400 rounded shadow mx-5 md:mx-0 ${user.is_activated ? '' : 'bg-red-100'} ${user.is_super_admin ? 'bg-green-300' : ''}`}
        >
          <h2 className="text-xl font-bold text-red-500">{user.name}</h2>
          <p className="font-bold text-red-500">
            Email: <span className="font-normal">{user.email}</span>
          </p>
          <p className="font-bold text-red-500">
            User id : <span className="font-normal">{user.id}</span>
          </p>
          {user.is_super_admin ? (
            <div className="flex gap-2">
              <p className="font-bold">
                is_super_admin:{' '}
                <span className="font-normal">
                  {user.is_super_admin ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
          ) : null}
          <div className="flex gap-2">
            <p className="font-bold text-red-500">
              is_admin:{' '}
              <span className="font-normal">
                {user.is_admin ? 'Yes' : 'No'}
              </span>
            </p>
            {!user.is_super_admin && (
              <p
                onClick={() => toggleAdminStatus(user)}
                className=" rounded-lg cursor-pointer text-red-500"
              >
                <ToggleLeft />
              </p>
            )}
          </div>
          <div className="flex gap-2 ">
            <p className="font-bold text-red-500">
              is_employee:{' '}
              <span className="font-normal">
                {' '}
                {user.is_employee ? 'Yes' : 'No'}
              </span>
            </p>
            {!user.is_super_admin && (
              <p
                onClick={() => toggleEmployeeStatus(user)}
                className=" rounded-lg cursor-pointer text-red-500"
              >
                <ToggleLeft />
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <p className="font-bold text-red-500">
              is_activated:{' '}
              <span className="font-normal">
                {' '}
                {user.is_activated ? 'Yes' : 'No'}
              </span>
            </p>
            {!user.is_super_admin && (
              <p
                onClick={() => toggleActivatedStatus(user)}
                className=" rounded-lg cursor-pointer text-red-500"
              >
                <ToggleLeft />
              </p>
            )}
          </div>
          {!user.is_super_admin && (
            <div>
              <p
                onClick={() => handleRestoreUser(user)}
                className="btn btn-primary btn-xs mt-5"
              >
                Restore User
              </p>
            </div>
          )}
        </div>
      ))}
    </SuperAdminDashboard>
  );
}

export default SuperAdminDeletedMembers;
