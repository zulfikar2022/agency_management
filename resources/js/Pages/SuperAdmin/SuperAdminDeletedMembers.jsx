import SuperAdminDashboard from './SuperAdminDashboard';

function SuperAdminDeletedMembers({ users }) {
  console.log(users);
  return (
    <SuperAdminDashboard>
      <h1 className="text-black">All Deleted Members</h1>
      <div></div>
    </SuperAdminDashboard>
  );
}

export default SuperAdminDeletedMembers;
