import LayoutForProduct from '../../layouts/LayoutForProduct';

function TodaysCollection({ collections }) {
  console.log({ collections });
  return (
    <LayoutForProduct>
      <h1>Today's Collections</h1>
    </LayoutForProduct>
  );
}

export default TodaysCollection;
