import ProductTable from '../components/ProductTable';
import LayoutForProduct from '../layouts/LayoutForProduct';

function ShowAllProducts({ user, products }) {
  return (
    <LayoutForProduct>
      <div className="flex flex-col  justify-between">
        <h1 className="text-center mt-3 text-3xl ">সকল পণ্য</h1>
        <ProductTable products={products?.data} />
        <div>
          <p className="text-center">pagination placeholder</p>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default ShowAllProducts;
