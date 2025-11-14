import LayoutForProduct from '../layouts/LayoutForProduct';

function ShowAllCustomers({ customers, user }) {
  console.log(user);
  console.log(customers);
  return (
    <LayoutForProduct>
      <div>All Customers Page</div>
    </LayoutForProduct>
  );
}

export default ShowAllCustomers;
