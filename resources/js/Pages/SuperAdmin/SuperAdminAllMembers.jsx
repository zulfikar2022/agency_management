import { Link, router } from '@inertiajs/react';
import SuperAdminDashboard from './SuperAdminDashboard';
import { ToggleLeft, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

// superadmin.toggleDeleteStatus
function SuperAdminAllMembers({ users }) {
  const deleteUser = (userId) => {
    Swal.fire({
      text: 'Are you sure you want to delete this user with id ' + userId + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('superadmin.toggleDeleteStatus', { user: userId }), {
          onSuccess: () => {
            toast.success('User deleted successfully!', {
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
  return (
    <SuperAdminDashboard>
      <h1 className="font-bold text-2xl text-center my-4">
        All (Not Deleted) Members
      </h1>
      {users?.length === 0 && <p>No members found.</p>}
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-4 mb-4 border rounded shadow mx-5 md:mx-0 ${user.is_activated ? '' : 'bg-red-100'} ${user.is_super_admin ? 'bg-green-300' : ''}`}
        >
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="font-bold">
            Email: <span className="font-normal">{user.email}</span>
          </p>
          <p className="font-bold">
            User id : <span className="font-normal">{user.id}</span>
          </p>
          <div className="flex gap-2">
            <p className="font-bold">
              is_super_admin:{' '}
              <span className="font-normal">
                {user.is_super_admin ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <p className="font-bold">
              is_admin:{' '}
              <span className="font-normal">
                {user.is_admin ? 'Yes' : 'No'}
              </span>
            </p>
            {!user.is_super_admin && (
              <p className=" rounded-lg cursor-pointer">
                <ToggleLeft />
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <p className="font-bold">
              is_employee:{' '}
              <span className="font-normal">
                {' '}
                {user.is_employee ? 'Yes' : 'No'}
              </span>
            </p>
            {!user.is_super_admin && (
              <p className=" rounded-lg cursor-pointer">
                <ToggleLeft />
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <p className="font-bold">
              is_activated:{' '}
              <span className="font-normal">
                {' '}
                {user.is_activated ? 'Yes' : 'No'}
              </span>
            </p>
            {!user.is_super_admin && (
              <p className=" rounded-lg cursor-pointer">
                <ToggleLeft />
              </p>
            )}
          </div>
          {!user.is_super_admin && (
            <div>
              <p
                onClick={() => deleteUser(user.id)}
                className="btn btn-error btn-xs mt-5"
              >
                Soft Delete
              </p>
            </div>
          )}
        </div>
      ))}
    </SuperAdminDashboard>
  );
}

export default SuperAdminAllMembers;
