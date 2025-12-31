import { dateFormatter } from '@/utilityFuntion';
import Chart from 'react-apexcharts';

function CustomerProductAdminDashboard({
  totalCustomers,
  sevenDayCollections,
  purchasesSummary,
  stockProductsTotalPrice,
  soldProductsTotalPrice,
  totalCollectedAmount,
  totalCost,
}) {
  let dates = Object.keys(sevenDayCollections);
  const collectedAmounts = dates.map(
    (date) => sevenDayCollections[date].collected_amount
  );
  const collectableAmounts = dates.map(
    (date) => sevenDayCollections[date].collectable_amount
  );

  dates = dates.map((date) => {
    return dateFormatter(date);
  });
  const series = [
    { name: 'পরিশোধিত পরিমাণ ', data: collectedAmounts, color: 'green' },
    { name: 'পরিশোধযোগ্য পরিমাণ', data: collectableAmounts, color: 'orange' },
  ];

  const options = {
    chart: { type: 'bar', stacked: false },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '50%' },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: dates },
    yaxis: { title: { text: 'পরিমাণ (টাকায়) ' } },
    tooltip: {
      shared: true,
      intersect: false,
    },
    title: {
      text: 'সপ্তাহব্যাপী সংগ্রহের পরিমাণ',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' },
    },
  };

  const productNames = Object.values(purchasesSummary).map(
    (item) => item.product_name
  );
  const totalPayable = Object.values(purchasesSummary).map(
    (item) => item.total_payable_price
  );
  const remainingPayable = Object.values(purchasesSummary).map(
    (item) => item.total_remaining_payable_price
  );
  const paidAmount = Object.values(purchasesSummary).map(
    (item) => item.total_payable_price - item.total_remaining_payable_price
  );

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 350,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'center',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `৳${val.toLocaleString()}`,
      style: { colors: ['#fff'], fontSize: '12px', fontWeight: 600 },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    title: {
      text: 'পণ্যভিত্তিক পেমেন্ট স্ট্যাটাস',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' },
    },
    xaxis: {
      categories: productNames,
      labels: {
        formatter: (val) => `৳${val.toLocaleString()}`,
      },
    },
    yaxis: {
      title: { text: 'পণ্যসমূহ' },
    },
    tooltip: {
      y: {
        formatter: (val) => `৳${val.toLocaleString()}`,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#00C49F', '#FF4560'], // Green = Paid, Red = Remaining Due
  };

  const chartSeries = [
    {
      name: 'পরিশোধিত পরিমাণ',
      data: paidAmount,
    },
    {
      name: 'বাকি পরিমাণ',
      data: remainingPayable,
    },
  ];

  return (
    <div>
      <p className="font-bold text-center text-lg mb-6 underline">
        পণ্য ও কাস্টমার সংক্রান্ত
      </p>
      <div className="grid items-center grid-cols-1 md:grid-cols-16 gap-2">
        <div className="grid-cols-1 md:col-span-3">
          <div className="border-b pb-2 mb-1">
            <p className="font-bold text-blue-700">মোট কাস্টমারঃ </p>
            <p>
              <span className="text-3xl font-bold">{totalCustomers}</span>
              <span>&nbsp;{'জন'}</span>
            </p>
          </div>
          <div className="border-b pb-2 mb-1">
            <p className="font-bold text-green-700">স্টকে পণ্যের মোট মূল্যঃ </p>
            <p>
              <span className="text-3xl font-bold">
                {stockProductsTotalPrice.toLocaleString()}
              </span>
              <span>&nbsp;{'টাকা'}</span>
            </p>
          </div>
          <div className="border-b pb-2 mb-1">
            <p className="font-bold text-green-700">
              বিক্রিত (সম্পূর্ন পরিশোধ হয়নি এমন) পণ্যের মোট মূল্যঃ{' '}
            </p>
            <p>
              <span className="text-3xl font-bold">
                {soldProductsTotalPrice.toLocaleString()}
              </span>
              <span>&nbsp;{'টাকা'}</span>
            </p>
          </div>

          <div className="pl-4">
            <div className="border-b pb-2 mb-1">
              <p className="font-bold text-green-500">মোট সংগৃহীত পরিমাণঃ </p>
              <p>
                <span className="text-3xl font-bold">
                  {totalCollectedAmount.toLocaleString()}
                </span>
                <span>&nbsp;{'টাকা'}</span>
              </p>
            </div>
            <div className="border-b pb-2 mb-1">
              <p className="font-bold text-green-500">মোট বাকিঃ </p>
              <p>
                <span className="text-3xl font-bold">
                  {(
                    soldProductsTotalPrice - totalCollectedAmount
                  ).toLocaleString()}
                </span>
                <span>&nbsp;{'টাকা'}</span>
              </p>
            </div>
          </div>
          <div className="border-b pb-2 mb-1">
            <p className="font-bold text-green-700">মোট খরচঃ </p>
            <p>
              <span className="text-3xl font-bold">
                {totalCost.toLocaleString()}
              </span>
              <span>&nbsp;{'টাকা'}</span>
            </p>
          </div>
        </div>
        <div className=" gird-cols-1 md:col-span-13">
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
      <div className="my-8">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
}

export default CustomerProductAdminDashboard;
