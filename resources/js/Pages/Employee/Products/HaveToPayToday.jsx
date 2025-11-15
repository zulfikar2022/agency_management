import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import ResponsiveTable from '../components/ResponsiveTable';

function HaveToPayToday({ customers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };
  const tableData = customerTableDataGenerateForEmployee(data);
  const today = new Date().toISOString().split('T')[0].toLowerCase();
  const todate = new Date().toISOString().split('T')[0];

  return (
    <EmployeeProductLayout>
      <p className="text-lg font-semibold text-center my-5">
        আজ পরিশোধ করতে হবে
      </p>
      <ResponsiveTable data={tableData} />
      {data?.length > 0 && (
        <Pagination
          paginationData={pagination}
          queryParams={{ today, todate }}
        />
      )}
    </EmployeeProductLayout>
  );
}

export default HaveToPayToday;
