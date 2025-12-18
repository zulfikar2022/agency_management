import LayoutForMoney from '../layouts/LayoutForMoney';
import MemberTable from './components/MemberTable';

function BankAllMembers({ members }) {
  console.log(members);
  return (
    <LayoutForMoney>
      <div>
        <h2 className="font-bold text-3xl text-center my-4"> সকল সদস্য</h2>
        <div className="container mx-auto">
          <MemberTable members={members} />
        </div>
      </div>
    </LayoutForMoney>
  );
}

export default BankAllMembers;
