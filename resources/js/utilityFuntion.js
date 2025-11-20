import dayjs from 'dayjs';
import { WEEKDAYS } from './constants';

export const customerTableDataGenerateForEmployee = (data) =>
  data?.map((customer) => ({
    আইডি: customer?.id,
    নাম: customer?.name,
    ঠিকানা: customer?.address,
    ফোন: customer?.phone_number,
    'কালেকশনের দিন':
      WEEKDAYS.find((day) => day.value === customer?.collection_day)?.label ||
      'নির্ধারিত নেই',
    'সাপ্তাহিক পরিশোধযোগ্য': customer?.purchases?.reduce(
      (total, purchase) => total + purchase.weekly_payable_price,
      0
    ),
    'মোট বাকি': customer?.purchases?.reduce(
      (total, purchase) => total + purchase.remaining_payable_price,
      0
    ),
  }));

export const dateFormatter = (dateString) => {
  // get the date in the following manner 12 March 2024 (Tuesday)
  const date = dayjs(dateString);
  const day = date.date();
  const month = date.format('MMMM');
  const year = date.year();
  const dayOfWeek = WEEKDAYS.find(
    (day) => day.value === date.format('dddd').toLowerCase()
  )?.label;
  return `${day} ${month} ${year} (${dayOfWeek})`;
};

export const timeFormatter = (dateString) => {
  // return time in the following manner 02:30 PM
  return dayjs(dateString).format('hh:mm A');
};
