import { Link } from '@inertiajs/react';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';

const Dashboard = ({ user }) => {
  console.log(user);
  return (
    <EmployeeDashboardLayout>
      <div className="container mx-auto">
        <div className="my-5">
          <p className="font-bold">
            আইডিঃ <span className="font-normal">{user?.id}</span>
          </p>
          <p className="font-bold">
            {' '}
            নামঃ &nbsp; &nbsp;&nbsp;
            <span className="font-normal">{user?.name}</span>
          </p>
          <p className="font-bold">
            ইমেইলঃ <span className="font-normal">{user?.email}</span>
          </p>
        </div>
      </div>
    </EmployeeDashboardLayout>
  );
};

export default Dashboard;
