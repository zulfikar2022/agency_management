import { useForm, usePage } from '@inertiajs/react';
import CollectMoneyForm from '../components/CollectMoneyForm';
import EmployeeProductLayout from '../layouts/EmployeeProductLayout';
import Swal from 'sweetalert2';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { WEEKDAYS } from '@/constants';
import CollectionListTable from '../components/CollectionListTable';

function CollectionPage({ user, customer, purchases, collections }) {
  let { data, setData, post, processing, errors } = useForm({
    customer_id: customer.id,
    customer_product_id: purchases.map((p) => p?.id),
    collectable_amount: purchases.map((p) => p?.weekly_payable_price || 0),
    collected_amount: purchases.map((p) => p?.weekly_payable_price || 0),
  });
  const { error: returnedErrorMessage } = usePage()?.props?.errors;

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
      title: 'আসলেই আপনি এই কিস্তি সংগ্রহ করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, চাই!',
    }).then((result) => {
      if (result.isConfirmed) {
        post(route('employee.storeCollection'), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('কিস্তি সফলভাবে সংগ্রহ করা হয়েছে!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: 'dark',
              transition: Bounce,
            });
          },
          onError: () => {
            toast.error(
              returnedErrorMessage || 'কিস্তি সংগ্রহে সমস্যা হয়েছে!',
              {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                transition: Bounce,
              }
            );
          },
        });
      }
    });
  };

  const handleMarkAsDue = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'আসলেই আপনি এই কিস্তি ডিউ হিসেবে চিহ্নিত করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, চাই!',
      cancelButtonText: 'না',
      reverseButtons: false,
    });

    if (!result.isConfirmed) return;
    post(route('employee.markAsDue'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('কিস্তি সফলভাবে ডিউ হিসেবে চিহ্নিত করা হয়েছে!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: 'dark',
          transition: Bounce,
        });
      },
      onError: () => {
        toast.error(
          returnedErrorMessage ||
            'কিস্তি ডিউ হিসেবে চিহ্নিত করতে সমস্যা হয়েছে!',
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            theme: 'dark',
            transition: Bounce,
          }
        );
      },
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
      <h1 className="text-2xl font-bold mb-4 border-b text-center md:container mx-2 md:mx-auto pb-2 ">
        কাস্টমার কালেকশন পেজ
      </h1>
      <div className="p-5 border container rounded-lg md:mx-auto mb-6 flex flex-col md:flex-row h-full md:justify-between">
        <div className="">
          <p>
            <span className="font-semibold">কাস্টমার নাম:</span>{' '}
            {customer?.name}
          </p>

          <p>
            <span className="font-semibold">কাস্টমার ফোন:</span>{' '}
            {customer?.phone_number}
          </p>
          <p>
            <span className="font-semibold">ঠিকানা:</span> {customer?.address}
          </p>
          <p>
            <span className="font-semibold">টাকা সংগ্রহের দিন:</span>{' '}
            {
              WEEKDAYS.find((day) => day.value === customer?.collection_day)
                ?.label
            }
          </p>
        </div>
        {/* আরও কাস্টমার সম্পর্কিত তথ্য এখানে দেখানো যেতে পারে */}

        <div className="flex flex-col mt-4 md:mt-0 items-start">
          <p className="  text-center">
            <span className="font-bold">পণ্যের মোট মূল্যঃ</span> {totalPrice}{' '}
            টাকা
          </p>
          <p className="  text-center">
            <span className="font-bold">মোট সাপ্তাহিক পরিশোধঃ</span>{' '}
            {purchases.reduce(
              (total, purchase) =>
                total + (purchase?.weekly_payable_price || 0),
              0
            )}{' '}
            টাকা
          </p>
          <p className="  text-center">
            <span className="font-bold">মোট পরিশোধিত পরিমানঃ</span>{' '}
            {totalPrice - totalRemainingPayable} টাকা
          </p>
          <p className="  text-center">
            <span className="font-bold">মোট বাকি আছেঃ</span>{' '}
            {totalRemainingPayable} টাকা
          </p>
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

        {purchases?.length > 0 && (
          <div className=" w-full max-w-md px-5 md:px-0">
            <button
              type="submit"
              disabled={processing}
              className="btn btn-neutral w-full max-w-md mb-5"
            >
              {processing ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Collecting...
                </>
              ) : (
                'কিস্তি সংগ্রহ করুন'
              )}
            </button>

            <p
              onClick={handleMarkAsDue}
              className="btn btn-outline w-full max-w-md"
              // disabled={processing}
            >
              ডিউ হিসেব চিহ্নিত করুন
            </p>
          </div>
        )}
      </form>
      {collections && collections.length > 0 && (
        <CollectionListTable collections={collections} />
      )}
    </EmployeeProductLayout>
  );
}

export default CollectionPage;

// employee.storeCollection
