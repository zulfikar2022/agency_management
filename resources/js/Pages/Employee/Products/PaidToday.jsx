import Pagination from '@/Pages/Admin/components/Pagination';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import { customerTableDataGenerateForEmployee } from '@/utilityFuntion';
import ResponsiveTable from '../components/ResponsiveTable';

function PaidToday({ customers }) {
  const data = customers?.data;
  const pagination = { ...customers, data: [] };
  const tableData = customerTableDataGenerateForEmployee(data);
  const actionData = [
    {
      label: 'কালেকশন করুন',
      routeName: 'employee.renderCollectionPage',
      routeHasParameter: true,
      paramName: 'id',
    },
    {
      label: 'বিস্তারিত দেখুন',
      routeName: 'employee.customerDetails',
      routeHasParameter: true,
      paramName: 'id',
    },
  ];

  return (
    <EmployeeProductLayout>
      <div className="text-lg font-semibold text-center my-5">
        আজ যারা টাকা দিয়েছে
      </div>
      <ResponsiveTable actionData={actionData} data={tableData} />
      {data?.length > 0 && <Pagination paginationData={pagination} />}
    </EmployeeProductLayout>
  );
}

export default PaidToday;
