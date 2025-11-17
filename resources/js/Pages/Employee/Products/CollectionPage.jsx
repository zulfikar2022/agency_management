import { useForm } from '@inertiajs/react';
import CollectMoneyForm from '../components/CollectMoneyForm';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import Swal from 'sweetalert2';
import { Bounce, toast, ToastContainer } from 'react-toastify';

function CollectionPage({ user, customer, purchases }) {
  console.log(purchases, customer);
  const { data, setData, post, processing, errors } = useForm({
    customer_id: customer.id,
    customer_product_id: purchases.map((p) => p?.id),
    collectable_amount: purchases.map((p) => p?.weekly_payable_price || 0),
    collected_amount: purchases.map((p) => p?.weekly_payable_price || 0),
  });

  const totalRemainingPayable = purchases.reduce(
    (total, purchase) => total + (purchase?.remaining_payable_price || 0),
    0
  );

  const totalPrice = purchases.reduce(
    (total, purchase) => total + (purchase?.total_payable_price || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'আসলেই আপনি এই পেমেন্ট সংগ্রহ করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, চাই!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: 'Deleted!',
        //   text: 'Your file has been deleted.',
        //   icon: 'success',
        // });
        //POST REQUEST TO THE SERVER
        // console.log(data);
        post(route('employee.storeCollection'), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('🦄 Wow so easy!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
              transition: Bounce,
            });
            // Reset collected_amount fields
            // setData((prevData) => ({
            //   ...prevData,
            //   collected_amount: prevData.collected_amount.map(() => ''),
            // }));
          },
        });
      }
    });
  };

  return (
    <EmployeeProductLayout>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <h1 className="text-2xl font-bold mb-4 border-b text-center">
        কাস্টমার কালেকশন পেজ
      </h1>
      <div className="p-5 border container rounded-lg mx-auto mb-6 flex flex-col md:flex-row h-full md:justify-between">
        <div className="">
          <p>
            <span className="font-semibold">কাস্টমার নাম:</span>{' '}
            {customer?.name}
          </p>

          <p>
            <span className="font-semibold">কাস্টমার ফোন:</span>{' '}
            {customer?.phone_number}
          </p>
        </div>
        {/* আরও কাস্টমার সম্পর্কিত তথ্য এখানে দেখানো যেতে পারে */}
        <div className="divider divider-vertical divider-info"></div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">
            পণ্যের মোট মূল্যঃ {totalPrice} টাকা
          </h2>
          <h2 className="text-xl font-bold mb-4 text-center">
            মোট সাপ্তাহিক পরিশোধঃ{' '}
            {purchases.reduce(
              (total, purchase) =>
                total + (purchase?.weekly_payable_price || 0),
              0
            )}{' '}
            টাকা
          </h2>
          <h2 className="text-xl font-bold mb-4 text-center">
            মোট বাকি পরিমানঃ {totalRemainingPayable} টাকা
          </h2>
          <h2 className="text-xl font-bold mb-4 text-center">
            মোট পরিশোধিত পরিমানঃ {totalPrice - totalRemainingPayable} টাকা
          </h2>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto"
      >
        {purchases.map((purchase, index) => {
          return (
            <div
              key={purchase.id}
              className="w-full max-w-md mb-6 px-5 md:px-0"
            >
              <p className="label">
                <span className="label-text font-medium">
                  <span>{purchase?.product?.name}</span>
                  <br />
                  <span className="flex flex-col">
                    <span>
                      সাপ্তাহিক পরিশোধঃ {purchase.weekly_payable_price} টাকা
                    </span>
                    <span>
                      বাকি আছেঃ {purchase.remaining_payable_price} টাকা
                    </span>
                  </span>
                </span>
              </p>
              <input
                type="number"
                name="collected_amount"
                min="1"
                step={1}
                className="input input-bordered p-2 mb-4"
                value={data?.collected_amount[index]}
                max={purchase.remaining_payable_price}
                onChange={(e) => {
                  setData((prevData) => {
                    const newCollectedAmounts = [...prevData.collected_amount];
                    newCollectedAmounts[index] = e.target.value;
                    return {
                      ...prevData,
                      collected_amount: newCollectedAmounts,
                    };
                  });
                }}
                // placeholder={`Max: ${collectable_amount}`}
                required
              />
            </div>
          );
        })}

        <div className=" w-full max-w-md px-5 md:px-0">
          <button
            type="submit"
            disabled={processing}
            className="btn btn-neutral w-full max-w-md "
          >
            {processing ? (
              <>
                <span className="loading loading-spinner"></span>
                Collecting...
              </>
            ) : (
              'পেমেন্ট সংগ্রহ করুন'
            )}
          </button>
        </div>
      </form>
    </EmployeeProductLayout>
  );
}

export default CollectionPage;

// employee.storeCollection
