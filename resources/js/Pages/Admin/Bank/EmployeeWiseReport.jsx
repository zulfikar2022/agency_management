import LayoutForMoney from '../layouts/LayoutForMoney';

function EmployeeWiseReport({
  employee,
  deposit_collections,
  total_deposit_collection,
  loan_collections,
  total_loan_collection,
  start_date,
  end_date,
}) {
  console.log(employee);
  console.log(deposit_collections);
  console.log(loan_collections);
  console.log(total_deposit_collection);
  console.log(total_loan_collection);
  console.log(start_date);
  console.log(end_date);
  return (
    <LayoutForMoney>
      <div className="container mx-auto">
        <p>Employee wise report</p>
      </div>
    </LayoutForMoney>
  );
}

export default EmployeeWiseReport;
