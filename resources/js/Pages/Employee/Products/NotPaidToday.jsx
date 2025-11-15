import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import ResponsiveTable from '../components/ResponsiveTable';

function NotPaidToday({ customers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };

  const tableData = customerTableDataGenerateForEmployee(data);

  return (
    <EmployeeProductLayout>
      <p className="text-lg font-semibold text-center my-5">
        আজ যারা টাকা দেয়নি
      </p>
      <ResponsiveTable data={tableData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </EmployeeProductLayout>
  );
}

export default NotPaidToday;
