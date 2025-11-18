import { useForm } from '@inertiajs/react';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';

function UpdateCollectionPage({ collections, customer, customer_products }) {
  const collectionPurchaseCombo = collections.map((collection) => {
    return {
      ...collection,
      purchase: customer_products.find(
        (product) => product.id === collection.customer_products_id
      ),
    };
  });

  console.log({ collectionPurchaseCombo });

  const { data, setData, put } = useForm({
    customer_id: customer?.id || '',
    collection_ids: collections.map((collection) => collection.id) || [],
    collected_amounts:
      collectionPurchaseCombo.map((combo) => combo?.collected_amount) || [],
  });
  console.log({ data });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting data:', data);
    put(route('employee.updateCollection'), data);
  };

  return (
    <EmployeeProductLayout>
      <div className=" px-2 container md:mx-auto mt-5">
        <h3 className="font-bold text-center">
          কাস্টমারের নামঃ <span className="font-normal">{customer?.name}</span>
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 ">
          {collectionPurchaseCombo.map((combo, index) => (
            <div key={combo?.id} className="">
              <div className="">
                <label className="text-slate-500 text-sm font-bold">
                  {combo.purchase?.product?.name} &nbsp;
                  {combo?.purchase?.weekly_payable_price -
                    combo?.collected_amount >
                    0 &&
                    `(বাকি: ${
                      combo?.purchase?.weekly_payable_price -
                      combo?.collected_amount
                    } টাকা)`}
                </label>
                <br />
                <input
                  type="number"
                  step={'1'}
                  className="input w-full md:w-1/2"
                  onChange={(e) => {
                    const newAmounts = [...data.collected_amounts];
                    newAmounts[index] = e.target.value;
                    setData('collected_amounts', newAmounts);
                  }}
                  value={data.collected_amounts[index] || ''}
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-neutral w-full md:w-1/2">
            আপডেট করুন
          </button>
        </form>
      </div>
    </EmployeeProductLayout>
  );
}

export default UpdateCollectionPage;
