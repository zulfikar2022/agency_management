import AdminDashboardLayout from "./AdminDashboardLayout";

function Dashboard({ user }) {
    console.log("User:", user);
    return (
       <AdminDashboardLayout>
        <div className="dashboard">
            <h5 className="text-3xl bg-red-600">Welcome to the Admin Dashboard</h5>
            <p>Hello, {user.name}! Here is your dashboard overview.</p>
        </div>
       </AdminDashboardLayout>
    );
}

export default Dashboard;
