import { Link } from '@inertiajs/react';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';

const Dashboard = ({ user }) => {
  console.log(user);
  return (
    <EmployeeDashboardLayout>
      <div className="p-4">Dashboard Content</div>
    </EmployeeDashboardLayout>
  );
};

export default Dashboard;
