import LayoutForMoney from '../layouts/LayoutForMoney';

function ProvideLoan({ member }) {
  return (
    <LayoutForMoney>
      <h1>Provide loan to {member?.name}</h1>
    </LayoutForMoney>
  );
}

export default ProvideLoan;
