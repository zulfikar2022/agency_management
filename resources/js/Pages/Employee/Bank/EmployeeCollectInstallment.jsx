import EmployeeBankLayout from '../layouts/EmployeeBankLayout';

function EmployeeCollectInstallment({ member }) {
  console.log(member);
  return (
    <EmployeeBankLayout>
      <h1 className="font-bold text-center text-2xl">কিস্তি উত্তোলন</h1>
    </EmployeeBankLayout>
  );
}

export default EmployeeCollectInstallment;
