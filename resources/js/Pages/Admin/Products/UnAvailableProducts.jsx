import ProductTable from '../components/ProductTable';
import LayoutForProduct from '../layouts/LayoutForProduct';

function InAvailableProducts({ products, user }) {
  return (
    <LayoutForProduct>
      <div className="flex flex-col  justify-evenly">
        <h1 className="text-center mt-3 text-3xl ">সকল পণ্য</h1>
        <ProductTable products={products?.data} />
        <div>
          <p className="text-center">pagination placeholder</p>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default InAvailableProducts;
