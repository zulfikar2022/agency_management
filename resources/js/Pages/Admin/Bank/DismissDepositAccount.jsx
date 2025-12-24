import LayoutForMoney from '../layouts/LayoutForMoney';

function DismissDepositAccount({
  member,
  deposit,
  total_day_missed,
  total_withdraw_amount,
  total_withdraw_times,
  total_collected_amount_withing_range,
}) {
  console.log(
    member,
    deposit,
    total_day_missed,
    total_withdraw_amount,
    total_withdraw_times,
    total_collected_amount_withing_range
  );
  return (
    <LayoutForMoney>
      <div className="container mx-auto my-5">
        <p>Dismiss Deposit Account Page</p>
      </div>
    </LayoutForMoney>
  );
}
export default DismissDepositAccount;
