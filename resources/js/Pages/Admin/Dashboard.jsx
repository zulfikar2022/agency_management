import AdminDashboardLayout from './AdminDashboardLayout';

function Dashboard({ user }) {
  return (
    <AdminDashboardLayout>
      <div className="dashboard h-full">
        <h5 className="text-3xl ">Welcome to the Admin Dashboard</h5>
        <p>Hello, {user.name}! Here is your dashboard overview.</p>
      </div>
    </AdminDashboardLayout>
  );
}

export default Dashboard;
