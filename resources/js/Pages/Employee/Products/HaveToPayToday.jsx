import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';

function HaveToPayToday({ customers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };
  console.log(data);
  return (
    <EmployeeProductLayout>
      <div className="p-4">Have To Pay Today Page</div>
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </EmployeeProductLayout>
  );
}

export default HaveToPayToday;
