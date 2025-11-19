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
