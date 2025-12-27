import Register from '../Auth/Register';
import SARegister from './SARegister';
import SuperAdminDashboard from './SuperAdminDashboard';

function SuperAdminRegisterUser() {
  return (
    <SuperAdminDashboard>
      <div>
        <p className="text-center text-2xl font-bold">Register User</p>
      </div>
      <div>
        <SARegister />
      </div>
    </SuperAdminDashboard>
  );
}

export default SuperAdminRegisterUser;
