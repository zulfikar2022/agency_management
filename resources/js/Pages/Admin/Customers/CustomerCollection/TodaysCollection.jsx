import { useState } from 'react';
import AdminTodaysCollectionResponsiveTable from '../../components/AdminTodaysCollectionResponsiveTable';
import LayoutForProduct from '../../layouts/LayoutForProduct';
import dayjs from 'dayjs';
import { Link, router, usePage } from '@inertiajs/react';
import CollectionReport from '../../Reports/CollectionReport';
import { dateFormatter } from '@/utilityFuntion';
import { pdf } from '@react-pdf/renderer';

function TodaysCollection({
  collections,
  totalReceivableAmount,
  total_collected_amount,
}) {
  // console.log(collections);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { url } = usePage();
  // console.log(collections);

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const formattedDate = dayjs(queryParams.get('todate')).format('D MMMM YYYY');

  const customersPaidIds = collections.map(
    (collection) => collection.customer.id
  );
  const customerUniqueIds = [];

  collections.forEach((collection) => {
    if (!customerUniqueIds.includes(collection.customer.id)) {
      customerUniqueIds.push(collection.customer.id);
    }
  });

  const showableCollectionData = [];

  customerUniqueIds.forEach((id) => {
    const customerId = id;
    const customerCollections = collections.filter(
      (collection) => collection.customer.id === customerId
    );
    const isUpdated = customerCollections.some(
      (collection) => collection.is_updated
    );

    showableCollectionData.push({
      customer: customerCollections[0].customer,
      product: customerCollections[0].product,
      totalCollectableAmount: customerCollections.reduce(
        (total, collection) => total + collection?.collectable_amount,
        0
      ),
      totalCollectedAmount: customerCollections.reduce(
        (total, collection) => total + collection?.collected_amount,
        0
      ),
      totalRemainingPayableAmount: customerCollections.reduce(
        (total, collection) =>
          total + collection?.customer_product?.remaining_payable_price,
        0
      ),
      totalWeeklyCollectableAmount: customerCollections.reduce(
        (total, collection) =>
          total + collection?.customer_product?.weekly_payable_price,
        0
      ),
      totalWeeklyCollectedAmount: customerCollections.reduce(
        (total, collection) => total + collection?.collected_amount,
        0
      ),
      createdAt: customerCollections[0].created_at,
      is_updated: isUpdated,
    });
  });

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    const blob = await pdf(
      <CollectionReport collections={showableCollectionData} />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    // আপনার পছন্দের নাম (বাংলা থাকলেও চলবে)
    const todayDate = dateFormatter(new Date());
    const fileName = `${dateFormatter(showableCollectionData[0]?.createdAt)}_এর_কালেকশন_রিপোর্ট_${todayDate}.pdf`;

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
      <p className="font-bold text-center text-2xl my-5">আজকের কালেকশন</p>
      <p className="font-bold text-center">
        আজকের টার্গেটঃ {totalReceivableAmount} টাকা
      </p>
      <p className="font-bold text-center mb-5">
        আজকের মোট কালেকশনঃ {total_collected_amount} টাকা
      </p>

      <div className="flex flex-col md:flex-row items-center justify-between md:mx-20 mb-5">
        <div className=" mb-10 flex flex-col md:flex-row gap-5 items-center ">
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              className="border border-gray-300 rounded-md p-2"
            />
            <Link
              href={route('admin.todaysCollections', {
                todate: date,
              })}
              className="btn btn-neutral ml-5"
            >
              খুঁজুন
            </Link>
          </div>

          <button
            onClick={handleGenerateReport}
            className="btn btn-xs btn-outline"
          >
            রিপোর্ট তৈরি করুন
          </button>
        </div>
        <div>
          <p className="font-bold">
            তারিখঃ <span className="font-normal">{formattedDate}</span>
          </p>
        </div>
      </div>
      <AdminTodaysCollectionResponsiveTable
        date={dayjs(date).format('D MMMM YYYY')}
        collections={showableCollectionData}
      />
    </LayoutForProduct>
  );
}

export default TodaysCollection;
