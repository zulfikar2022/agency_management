import LayoutForProduct from '../../layouts/LayoutForProduct';

function HavePaidToday({ customers, totalCustomers }) {
  console.log({ customers, totalCustomers });
  return (
    <LayoutForProduct>
      <h1>Customers Who Have Paid Today</h1>
    </LayoutForProduct>
  );
}

export default HavePaidToday;
