import LayoutForProduct from '../../layouts/LayoutForProduct';

function HaveToPayToday({ customers, totalCustomers }) {
  console.log({ customers, totalCustomers });
  return (
    <LayoutForProduct>
      <h1>Customers Who Have To Pay Today</h1>
    </LayoutForProduct>
  );
}

export default HaveToPayToday;
