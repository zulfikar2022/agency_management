import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';

function PaidToday({ customers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };

  return (
    <EmployeeProductLayout>
      <div className="p-4">Paid Today Page</div>
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </EmployeeProductLayout>
  );
}

export default PaidToday;
