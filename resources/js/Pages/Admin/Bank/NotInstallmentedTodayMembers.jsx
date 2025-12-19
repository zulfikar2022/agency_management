import LayoutForMoney from '../layouts/LayoutForMoney';

function NotInstallmentedTodayMembers({ members }) {
  console.log(members);
  return (
    <LayoutForMoney>
      <div>
        <h2 className="font-bold text-3xl text-center my-4">
          আজকে কিস্তি না দেওয়া সদস্যগণ দেখুন{' '}
        </h2>
      </div>
    </LayoutForMoney>
  );
}

export default NotInstallmentedTodayMembers;
