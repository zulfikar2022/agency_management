import { Head } from '@inertiajs/react';
import AdminDashboardLayout from '../../AdminDashboardLayout';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { dateFormatter } from '@/utilityFuntion';

function DECalculator({ dataEntryMode = false }) {
  // 115th day calculator
  const [startDate, setStartDate] = useState('');
  const [one15thDay, set115thDay] = useState(null);

  // day difference calculator (not used currently)
  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [dayDifference, setDayDifference] = useState(null);

  // daily payable interest, main and total calculator (not used currently)
  const [loan, setLoan] = useState(0);
  const [dailyPayableInterest, setDailyPayableInterest] = useState(0);
  const [dailyPayableMain, setDailyPayableMain] = useState(0);
  const [dailyPayableTotal, setDailyPayableTotal] = useState(0);

  //
  const [baseDate, setBaseDate] = useState('');
  const [resultDate, setResultDate] = useState(null);
  const [daysToAdd, setDaysToAdd] = useState(0);

  return (
    <AdminDashboardLayout dataEntryMode={dataEntryMode}>
      <Head title="Calculator" />
      <div className="container mx-auto">
        <div>
          {/* start date will be given via user and the 115th day of the provided day will be output */}
          <h1 className="text-2xl font-bold mb-4">Data Entry Calculator</h1>
          <p className="mb-2 font-bold">
            কোন দিনের ১১৫তম দিন নির্ণয় করতে নিচের ফর্মটি ব্যবহার করুন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-items-center border-b pb-4 mb-4">
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <p>{startDate ? dateFormatter(new Date(startDate)) : ''}</p>
            </div>
            <button
              type="button"
              className="btn btn-xs btn-neutral text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                const startDateInput =
                  document.getElementById('startDate').value;
                if (startDateInput) {
                  const startDate = new Date(startDateInput);
                  const resultDate = new Date(startDate);
                  resultDate.setDate(startDate.getDate() + 115);
                  set115thDay(resultDate);
                } else {
                  toast.error('তারিখ নির্বাচন করুন', {
                    position: 'top-center',
                    theme: 'dark',
                    autoClose: 5000,
                    hideProgressBar: false,
                  });
                }
              }}
            >
              Calculate 115th Day
            </button>
            <p>{one15thDay ? dateFormatter(one15thDay) : ''}</p>
          </div>
        </div>

        {/* will take 2 dates and calculate the difference */}
        <div className="border-b pb-4 mb-4">
          <p className="mb-2 font-bold">
            দুই তারিখের মধ্যে দিন সংখ্যা নির্ণয় করতে নিচের ফর্মটি ব্যবহার করুন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-items-center">
            <div className="mb-4">
              <label
                htmlFor="firstDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Date:
              </label>
              <input
                type="date"
                id="firstDate"
                value={firstDate}
                onChange={(e) => setFirstDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="secondDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Second Date:
              </label>
              <input
                type="date"
                id="secondDate"
                value={secondDate}
                onChange={(e) => setSecondDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <button
              type="button"
              className="btn btn-xs btn-neutral text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                const firstDateInput =
                  document.getElementById('firstDate').value;
                const secondDateInput =
                  document.getElementById('secondDate').value;
                if (firstDateInput && secondDateInput) {
                  const firstDate = new Date(firstDateInput);
                  const secondDate = new Date(secondDateInput);
                  const timeDifference = Math.abs(secondDate - firstDate);
                  const dayDifference = Math.ceil(
                    timeDifference / (1000 * 60 * 60 * 24)
                  );
                  setDayDifference(dayDifference);
                } else {
                  toast.error('দুটি তারিখই নির্বাচন করুন', {
                    position: 'top-center',
                    theme: 'dark',
                    autoClose: 5000,
                    hideProgressBar: false,
                  });
                }
              }}
            >
              Calculate Day Difference
            </button>
            <p className="font-bold">
              {dayDifference !== null ? dayDifference + ' days' : ''}
            </p>
          </div>
        </div>
        {/* this input field will take a date as input and a number as another input. The result will be the day after the selected date and adding the day provided number */}
        <div>
          <p className="mb-2 font-bold">
            একটি তারিখ এবং দিন সংখ্যা প্রদান করে নির্দিষ্ট দিনের তারিখ নির্ণয়
            করতে নিচের ফর্মটি ব্যবহার করুন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-items-center border-b pb-4 mb-4">
            <div className="mb-4">
              <label
                htmlFor="baseDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Base Date:
              </label>
              <input
                type="date"
                id="baseDate"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="daysToAdd"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Days to Add:
              </label>
              <input
                type="number"
                id="daysToAdd"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <button
              type="button"
              className="btn btn-xs btn-neutral text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                const baseDateInput = document.getElementById('baseDate').value;
                if (baseDateInput && daysToAdd >= 0) {
                  const baseDate = new Date(baseDateInput);
                  const outputDate = new Date(baseDate);
                  outputDate.setDate(baseDate.getDate() + daysToAdd);
                  setResultDate(outputDate);
                  // toast.success(
                  //   `Resulting Date: ${dateFormatter(resultDate)}`,
                  //   {
                  //     position: 'top-center',
                  //     theme: 'dark',
                  //     autoClose: 5000,
                  //     hideProgressBar: false,
                  //   }
                  // );
                } else {
                  toast.error('সঠিক তারিখ এবং দিন সংখ্যা প্রদান করুন', {
                    position: 'top-center',
                    theme: 'dark',
                    autoClose: 5000,
                    hideProgressBar: false,
                  });
                }
              }}
            >
              Calculate Resulting Date
            </button>
            <div>
              <p>{resultDate ? dateFormatter(resultDate) : ''}</p>
            </div>
          </div>
        </div>
        {/* There will be a number input field and which will used to provide the main amount of loan. it will calculate three things: daily payable interest, daily payable main and daily payable total. daily payable interest will be calculated by  finding the 15% of the input value and dividing it by 115 and making it rounded(for fractional numbers), daily payable main will be calculated by dividing the provided input value dividing by 115 and total will be the sum of these two. */}
        <div className="border-b pb-4 mb-4">
          <p className="mb-2 font-bold">
            দৈনিক পরিশোধযোগ্য সুদ, মূলধন এবং মোট পরিশোধযোগ্য অর্থ নির্ণয় করতে
            নিচের ফর্মটি ব্যবহার করুন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-items-center">
            <div className="mb-4">
              <label
                htmlFor="loanAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loan Amount:
              </label>
              <input
                type="number"
                id="loanAmount"
                value={loan}
                onChange={(e) => setLoan(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <button
              type="button"
              className="btn btn-xs btn-neutral text-white px-4 py-2 rounded-md hover:bg-blue -600"
              onClick={() => {
                if (loan > 0) {
                  const dailyInterest = ((loan * 0.15) / 115).toFixed(2);
                  const dailyMain = (loan / 115).toFixed(2);
                  const dailyTotal =
                    parseFloat(dailyInterest) + parseFloat(dailyMain);
                  setDailyPayableInterest(dailyInterest);
                  setDailyPayableMain(dailyMain);
                  setDailyPayableTotal(dailyTotal);
                } else {
                  toast.error('ঋণের পরিমাণ সঠিকভাবে প্রদান করুন', {
                    position: 'top-center',
                    theme: 'dark',
                    autoClose: 5000,
                    hideProgressBar: false,
                  });
                }
              }}
            >
              Calculate Daily Payables
            </button>
            <div className="text-center">
              <p className="font-bold">
                Daily Payable Interest:{' '}
                <span className="font-normal">
                  {dailyPayableInterest} Taka
                </span>{' '}
              </p>
              <p className="font-bold">
                Daily Payable Main:{' '}
                <span className="font-normal">
                  {dailyPayableMain} Taka
                </span>{' '}
              </p>
              <p className="font-bold">
                Daily Payable Total:{' '}
                <span className="font-normal">
                  {dailyPayableTotal} Taka
                </span>{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
export default DECalculator;
