import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import ResponsiveTable from '../components/ResponsiveTable';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';

function AllCustomers({ customers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };

  const tableData = customerTableDataGenerateForEmployee(data);

  return (
    <EmployeeProductLayout>
      <p className="text-lg font-semibold text-center my-5">সকল কাস্টমার</p>
      <ResponsiveTable data={tableData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </EmployeeProductLayout>
  );
}

export default AllCustomers;
