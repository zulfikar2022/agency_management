import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import ResponsiveTable from '../components/ResponsiveTable';

function PaidToday({ customers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };
  const tableData = customerTableDataGenerateForEmployee(data);

  return (
    <EmployeeProductLayout>
      <div className="text-lg font-semibold text-center my-5">
        আজ যারা টাকা দিয়েছে
      </div>
      <ResponsiveTable data={tableData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </EmployeeProductLayout>
  );
}

export default PaidToday;
