import { dateFormatter } from '@/utilityFuntion';
import Chart from 'react-apexcharts';
// import { dateFormatter } from '@/utilityFuntion';

function BankLoanDepositAdminDashboard({
  totalMembers,
  depositAccountCount,
  loanAccountCount,
  totalDepositAmount,
  totalLoanedAmount,
  totalCollectionForLoan,
  dateWiseLoanAndDepositCollections,
  totalInterestPaidForLoan,
  totalMainPaidForLoan,
  totalRemainingPayableMain,
  totalRemainingPayableInterest,
  activeTotalLoanedAmount,
  totalAdmissionFee,
  totalLoanFee,
  totalShareMoney,
}) {
  console.log(totalAdmissionFee);
  return (
    <div>
      <p className="font-bold text-center text-lg underline mb-6">
        সঞ্চয় ও ঋণ সংক্রান্ত
      </p>
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-1 md:col-span-1">
          <div className="border-b">
            <p className="font-bold text-blue-700 text-lg">মোট সদস্য সংখ্যা:</p>
            <p className="font-normal">
              <span className="text-2xl font-bold">{totalMembers}</span> &nbsp;
              জন
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">সঞ্চয়ী একাউন্ট করেছনঃ</p>
            <p className="font-normal">
              <span className="text-2xl font-bold">{depositAccountCount}</span>{' '}
              &nbsp; জন
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">ঋণ নিয়েছেনঃ</p>
            <p className="font-normal">
              <span className="text-2xl font-bold">{loanAccountCount}</span>{' '}
              &nbsp; জন
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">মোট সংগৃহীত ভর্তি ফিঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(totalAdmissionFee / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">মোট সংগৃহীত ঋণ ফিঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(totalLoanFee / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">মোট সংগৃহীত শেয়ার জমাঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(totalShareMoney / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">মোট সঞ্চিত পরিমাণঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {/* format the following number so that it only shows 2 digits after the decimal point */}
                {(totalDepositAmount / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">মোট ঋণের পরিমাণঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(totalLoanedAmount / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">মোট চলমান ঋণের পরিমাণঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(activeTotalLoanedAmount / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">
              চলমান ঋণের কিস্তি বাবদ মোট সংগ্রহঃ{' '}
            </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(totalCollectionForLoan / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="pl-5">
            <div className="border-b mt-2">
              <p className="font-bold text-green-500">মোট আসল সংগ্রহঃ </p>
              <p className="font-normal">
                <span className="text-2xl font-bold">
                  {(totalMainPaidForLoan / 100).toFixed(2)}
                </span>{' '}
                &nbsp; টাকা
              </p>
            </div>
            <div className="border-b mt-2">
              <p className="font-bold text-green-500">মোট সুদ সংগ্রহঃ </p>
              <p className="font-normal">
                <span className="text-2xl font-bold">
                  {(totalInterestPaidForLoan / 100).toFixed(2)}
                </span>{' '}
                &nbsp; টাকা
              </p>
            </div>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">মোট আসল বাকিঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(totalRemainingPayableMain / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
          <div className="border-b mt-2">
            <p className="font-bold text-green-700">আজকের মোট সুদ বাকিঃ </p>
            <p className="font-normal">
              <span className="text-2xl font-bold">
                {(totalRemainingPayableInterest / 100).toFixed(2)}
              </span>{' '}
              &nbsp; টাকা
            </p>
          </div>
        </div>
        <div className="col-span-1 md:col-span-4">
          <CollectionChart collectionData={dateWiseLoanAndDepositCollections} />
        </div>
      </div>
    </div>
  );
}

export function CollectionChart({ collectionData }) {
  // 1. Extract and Format Data
  const dates = collectionData.map((item) => dateFormatter(item.date));

  // Ensure values are numbers (in case backend sends them as strings)
  const depositCollections = collectionData.map((item) =>
    parseFloat(item.deposit_collections / 100 || 0)
  );

  const loanCollections = collectionData.map((item) =>
    parseFloat(item.loan_collections / 100 || 0)
  );

  // 2. Define Series
  const series = [
    {
      name: 'সঞ্চয় সংগ্রহ',
      data: depositCollections,
    },
    {
      name: 'ঋণের কিস্তি  সংগ্রহ',
      data: loanCollections,
    },
  ];

  // 3. Define Options
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: true },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: false, // Set to true if you want numbers on top of bars
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: dates,
      title: {
        text: 'তারিখ',
        style: { fontWeight: 'bold' },
      },
    },
    yaxis: {
      title: {
        text: 'পরিমাণ (টাকায়)',
        style: { fontWeight: 'bold' },
      },
      labels: {
        formatter: (val) => `৳${val.toLocaleString()}`,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `৳${val.toLocaleString()} টাকা`,
      },
    },
    colors: ['#008FFB', '#00E396'], // Blue for Deposits, Green for Loans
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    title: {
      text: 'সাপ্তাহিক সঞ্চয় ও ঋণ সংগ্রহের তুলনামূলক চিত্র',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold', color: '#333' },
    },
  };

  return (
    <div className="p-4 rounded-lg border border-gray-100">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}

export default BankLoanDepositAdminDashboard;
