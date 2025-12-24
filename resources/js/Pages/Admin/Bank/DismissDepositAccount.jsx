import LayoutForMoney from '../layouts/LayoutForMoney';

function DismissDepositAccount({
  member,
  deposit,
  total_day_missed,
  total_withdraw_amount,
  total_withdraw_times,
  total_collected_amount_withing_range,
  lower_amount_days_count_than_promised,
  higher_amount_days_count_than_promised,
}) {
  console.log(total_collected_amount_withing_range);
  // member,
  // deposit,
  // total_day_missed,
  // total_withdraw_amount,
  // total_withdraw_times,
  // total_collected_amount_withing_range

  return (
    <LayoutForMoney>
      <div className="container mx-auto my-5">
        <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-5">
          <div>
            <p className="font-bold">
              সদস্যের আইডিঃ <span className="font-normal ">{member.id}</span>
            </p>
            <p className="font-bold">
              সদস্যের নামঃ <span className="font-normal">{member.name}</span>
            </p>
            <p className="font-bold">
              দৈনিক প্রতিশ্রুত সঞ্চয়ের পরিমাণঃ{' '}
              <span className="font-normal text-xl">
                {(deposit.daily_deposit_amount / 100).toFixed(2)} টাকা
              </span>
            </p>
          </div>
          <div>
            <p className="font-bold">
              একাউন্টে সঞ্চিত টাকার পরিমাণঃ{' '}
              <span className="font-normal text-xl">
                {(member.total_deposit / 100).toFixed(2)} টাকা
              </span>
            </p>
            <p className="font-bold">
              প্রতিশ্রুত পরিমাণ অনুযায়ী (দৈনিক{' '}
              {(deposit.daily_deposit_amount / 100).toFixed(2)} টাকা) মোট
              সংগৃহীত সঞ্চয়ঃ{' '}
              <span className="font-normal text-xl">
                {(total_collected_amount_withing_range / 100).toFixed(2)} টাকা
              </span>
            </p>
            <p className="font-bold">
              দৈনিক প্রতিস্রুত পরিমাণের চেয়ে কম দিয়েছেঃ{' '}
              <span className="font-normal text-xl">
                {lower_amount_days_count_than_promised} দিন
              </span>
            </p>
            <p className="font-bold">
              দৈনিক প্রতিস্রুত পরিমাণের চেয়ে বেশি দিয়েছেঃ{' '}
              <span className="font-normal text-xl">
                {higher_amount_days_count_than_promised} দিন
              </span>
            </p>
            <p className="font-bold text-red-600">
              মোট সঞ্চয় দেয়নিঃ{' '}
              <span className="font-normal text-xl">
                {total_day_missed} দিন
              </span>
            </p>
            <p className="font-bold text-red-600">
              মোট টাকা উত্তোলন করেছেঃ{' '}
              <span className="font-normal text-xl">
                {total_withdraw_times} দিন
              </span>
            </p>
            <p className="font-bold text-red-600">
              মোট টাকা উত্তোলনের পরিমাণঃ{' '}
              <span className="font-normal text-xl">
                {(total_withdraw_amount / 100).toFixed(2)} টাকা
              </span>
            </p>
          </div>
        </div>
      </div>
    </LayoutForMoney>
  );
}
export default DismissDepositAccount;
