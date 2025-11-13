import ProductTable from '../components/ProductTable';
import LayoutForProduct from '../layouts/LayoutForProduct';

function AvailableProducts({ products, user }) {
  return (
    <LayoutForProduct>
      <div className="flex flex-col justify-evenly">
        <h1 className="text-center mt-3 text-3xl ">এভেইলেবল পণ্যসমূহ</h1>
        <ProductTable products={products?.data} />
        <div>
          <p className="text-center">pagination placeholder</p>
        </div>
      </div>
    </LayoutForProduct>
  );
}

export default AvailableProducts;
