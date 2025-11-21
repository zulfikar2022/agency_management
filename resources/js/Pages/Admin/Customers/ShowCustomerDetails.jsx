import { WEEKDAYS } from '@/constants';
import LayoutForProduct from '../layouts/LayoutForProduct';
import { Link, router, usePage } from '@inertiajs/react';
import GoBack from '../components/GoBack';
import BoughtList from '../components/BoughtList';
import Swal from 'sweetalert2';
import ResponsiveCustomerDetailsTable from '../components/ResponsiveCustomerDetailsTable';
import AdminCollectionList from '../components/AdminCollectionList';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import IndividualCustomerReport from '../Reports/IndividualCustomerReport';
import dayjs from 'dayjs';
import { dateFormatter } from '@/utilityFuntion';

function ShowCustomerDetails({
  customer,
  purchagedProducts,
  paymentLists,
  total_payable_price,
  total_downpayment,
}) {
  const { previousUrl } = usePage().props;
  const totalRemainingPayable = purchagedProducts?.reduce(
    (total, item) => total + item?.remaining_payable_price,
    0
  );

  let totalPaymentByCollection = paymentLists?.reduce(
    (total, item) => total + item?.collected_amount,
    0
  );

  let totalWeeklyPayable = 0;
  purchagedProducts?.forEach((item) => {
    if (item?.remaining_payable_price > 0) {
      totalWeeklyPayable += item?.weekly_payable_price;
    }
  });

  const collectionDayLabel = WEEKDAYS.find(
    (day) => day.value === customer.collection_day
  )?.label;
  const handleDelete = () => {
    Swal.fire({
      // title: 'Are you sure?',
      text: 'আপনি কি আসলেই এই কাস্টমারকে ডিলিট করতে চান? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09090b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.deleteCustomer', customer.id));
        Swal.fire({
          title: 'ডিলিট করা হয়েছে!',
          icon: 'success',
        });
      }
    });
  };

  console.log(paymentLists);

  const handleGeneratePdf = async (e) => {
    e.preventDefault();

    const blob = await pdf(
      <IndividualCustomerReport
        customer={customer}
        purchagedProducts={purchagedProducts}
        total_remaining_payable={totalRemainingPayable}
        collections={paymentLists}
        total_payable_price={total_payable_price}
        total_downpayment={total_downpayment}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    // আপনার পছন্দের নাম (বাংলা থাকলেও চলবে)
    const todayDate = dateFormatter(new Date());
    const fileName = `${customer?.name || 'Customer'}_${customer?.phone_number}_রিপোর্ট_${todayDate}.pdf`;

    // নতুন ট্যাব খোলা + সুন্দর টাইটেল + ডাউনলোড নাম সেট
    const newWindow = window.open('', '_blank');

    // আপনার handleGeneratePdf ফাংশনের ভিতরে এই অংশটা বদলান

    if (newWindow) {
      newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="utf-8">
        <title>${fileName}</title>
        <style>
          body, html { margin:0; padding:0; height:100%; overflow:hidden; background:#f3f4f6; }
          embed { width:100%; height:100%; border:none; }
          #downloadBtn {
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 9999;
            padding: 12px 20px;
            background: #1e40af;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          #downloadBtn:hover { background: #1e3a8a; }
        </style>
      </head>
      <body>
        <button id="downloadBtn">ডাউনলোড করুন </button>
        <embed src="${url}" type="application/pdf" width="100%" height="100%">
      </body>
    </html>
  `);
      newWindow.document.close();

      // এই অংশটা যোগ করুন — এটাই মূল কাজ করবে
      newWindow.onload = () => {
        const btn = newWindow.document.getElementById('downloadBtn');
        if (btn) {
          btn.onclick = () => {
            const a = newWindow.document.createElement('a');
            a.href = url;
            a.download = fileName; // এটাই আপনার নাম সেট করে
            a.click();
          };
        }
      };
    } else {
      alert('পপআপ ব্লক করা আছে। অনুগ্রহ করে পপআপ অনুমোদন করুন।');
    }

    // মেমরি ক্লিন (১ মিনিট পর)
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  return (
    <LayoutForProduct>
      <GoBack
        targetRouteName="admin.showCustomers"
        text="কাস্টমার তালিকায় ফিরে যান"
      />
      <div>
        <h1 className="text-center mt-3 text-3xl ">
          কাস্টমারের বিস্তারিত তথ্য
        </h1>

        <div className="mx-auto md:mx-auto mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row md:justify-between md:w-3/4 lg:w-2/4 ">
          <div className="border-b md:border-r md:border-b-0 pr-6 pb-6">
            <p>
              <strong>নাম:</strong> {customer.name}
            </p>
            {customer.fathers_name && (
              <p>
                <strong>পিতার নাম:</strong> {customer.fathers_name}
              </p>
            )}
            {customer.mothers_name && (
              <p>
                <strong>মাতার নাম:</strong> {customer.mothers_name}
              </p>
            )}
            {customer.nid_number && (
              <p>
                <strong>এনআইডি নম্বর:</strong> {customer.nid_number}
              </p>
            )}
            <p>
              <strong>ফোন নম্বর:</strong> {customer.phone_number}
            </p>
            <p>
              <strong>ঠিকানা:</strong> {customer.address}
            </p>
            <p>
              <strong>টাকা সংগ্রহের দিন:</strong> {collectionDayLabel}
            </p>
          </div>
          <div className="border-b md:border-r md:border-b-0 pr-6 pb-6">
            <p>
              মোট পরিশোধযোগ্যঃ{' '}
              <span className="font-bold">{total_payable_price}</span> টাকা
            </p>

            <p>
              মোট ডাউনপেমেন্টঃ{' '}
              <span className="font-bold">{total_downpayment}</span> টাকা
            </p>
            <p>
              কিস্তিতে মোট পরিশোধঃ{' '}
              <span className="font-bold">{totalPaymentByCollection}</span> টাকা
            </p>
            <p>
              সাপ্তাহিক পরিশোধ যোগ্যঃ{' '}
              <span className="font-bold">{totalWeeklyPayable}</span> টাকা
            </p>
            <p>
              মোট বাকি আছেঃ{' '}
              <span className="font-bold">{totalRemainingPayable}</span> টাকা
            </p>
          </div>
          <div className="flex flex-col justify-between mt-5 md:mt-0">
            <Link
              href={route('admin.editCustomer', customer.id)}
              className="btn btn-xs btn-outline mb-3"
            >
              কাস্টমারের তথ্য আপডেট করুন
            </Link>
            {totalRemainingPayable == 0 && (
              <button
                onClick={handleDelete}
                // href={route('admin.deleteCustomer', customer.id)}
                className="btn btn-xs btn-error mb-3"
              >
                কাস্টমার ডিলিট করুন
              </button>
            )}
            {totalRemainingPayable > 0 && (
              <button
                className="btn btn-xs btn-outline"
                onClick={handleGeneratePdf}
              >
                রিপোর্ট তৈরি করুন
              </button>
            )}
            <Link
              href={route('admin.sellProductToCustomerPage', customer.id)}
              className="btn btn-xs btn-neutral mb-3"
            >
              পণ্য বিক্রয় করুন
            </Link>
          </div>
        </div>
        {/* <BoughtList purchagedProducts={purchagedProducts} /> */}
        <ResponsiveCustomerDetailsTable purchagedProducts={purchagedProducts} />

        <AdminCollectionList collections={paymentLists} />
      </div>
    </LayoutForProduct>
  );
}

export default ShowCustomerDetails;

// admin.sellProductToCustomerPage;
