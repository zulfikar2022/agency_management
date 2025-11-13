
function AdminDashboardLayout({ children }) {
    return (
    <div className="admin-dashboard-layout">
      <header className="admin-dashboard-header">
       <p>Header Content</p>
      </header>
      <main className="admin-dashboard-content">{children}</main>
      <footer className="admin-dashboard-footer">
        <p>&copy; 2023 Your Company</p>
      </footer>
    </div>
  );
}
  

export default AdminDashboardLayout;