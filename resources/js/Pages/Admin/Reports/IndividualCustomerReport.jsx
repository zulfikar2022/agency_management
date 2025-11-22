import { WEEKDAYS } from '@/constants';
import { dateFormatter, sanitizeForPDF } from '@/utilityFuntion';
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';

Font.register({
  family: 'NotoSansBengali',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansBengali/NotoSansBengali-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

Font.register({
  family: 'Helvetica', // Built-in, but explicit for safety
  fonts: [{ src: 'Helvetica', fontWeight: 'normal' }],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansBengali',
    fontSize: 12,
    lineHeight: 1.6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 120,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  section: {
    marginBottom: 20,
  },
  table: {
    marginTop: 20,
    border: '1px solid #374151',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #374151',
  },
  tableHeader: {
    backgroundColor: '#e5e7eb',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 10,
    flex: 1,
    textAlign: 'center',
  },
});

function IndividualCustomerReport({
  customer,
  purchagedProducts,
  collections,
  total_payable_price,
  total_downpayment,
  total_remaining_payable,
}) {
  let totalPaymentByCollection = collections?.reduce(
    (total, item) => total + item?.collected_amount,
    0
  );
  let totalWeeklyPayable = 0;
  purchagedProducts?.forEach((item) => {
    if (item?.remaining_payable_price > 0) {
      totalWeeklyPayable += item?.weekly_payable_price;
    }
  });
  const totalRemainingPayable = purchagedProducts?.reduce(
    (total, item) => total + item?.remaining_payable_price,
    0
  );
  const uniqueDays = [];
  const sameDayCollections = [];
  console.log({ collections });

  collections?.forEach((collection) => {
    if (uniqueDays.indexOf(collection.collecting_date) === -1) {
      uniqueDays.push(collection.collecting_date);
    }
  });

  for (let i = 0; i < uniqueDays.length; i++) {
    const date = uniqueDays[i];

    const collectionsOfTheDay = collections?.filter(
      (collection) => collection.collecting_date === date
    );

    const sameDayCollectionsIds = collections
      .filter((collection) => collection.collecting_date === date)
      .map((item) => item.id);

    const formattedCreatedAt = dayjs(collectionsOfTheDay[0]?.created_at);

    const day = formattedCreatedAt.date();
    const dateDay = formattedCreatedAt.format('dddd')?.toLowerCase();
    const month = formattedCreatedAt.format('MMMM');
    const year = formattedCreatedAt.year();

    // sameDayCollectionsIds.push(collectionsOfTheDay[0]?.id);

    sameDayCollections.push({
      totalCollected: collectionsOfTheDay.reduce(
        (total, item) => total + item.collected_amount,
        0
      ),
      totalCollectable: collectionsOfTheDay.reduce(
        (total, item) => total + item.collectable_amount,
        0
      ),
      id: sameDayCollectionsIds.join('-'),
      createdAt: `${day} ${month} ${year} (${WEEKDAYS.find((day) => day.value === dateDay)?.label})`,
      isUpdated: collectionsOfTheDay.some((item) => item.isUpdated),
      collectingUser: collectionsOfTheDay[0]?.collectingUser,
    });
  }

  const dateOfTheReport = dateFormatter(new Date());
  return (
    <Document>
      {/* এখানে style={styles.page} দিতে হবে */}
      <Page title="কাস্টমার রিপোর্ট" style={styles.page}>
        <View>
          <Text style={styles.title}>{'\u200B'}Customer Report</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={{ fontWeight: 'bold' }}>
              কাস্টমারের নামঃ{' '}
              <Text style={{ fontWeight: 'normal' }}>
                {sanitizeForPDF(customer?.name) || 'নাম নেই'}
              </Text>
            </Text>
            <View>
              <Text style={{ display: 'block', fontWeight: 'bold' }}>
                কাস্টমারের ঠিকানাঃ
              </Text>{' '}
              <Text style={{ fontWeight: 'normal' }}>
                {customer?.address ?? 'ঠিকানা নেই'}
              </Text>
            </View>
            <Text style={{ fontWeight: 'bold' }}>
              মোবাইলঃ{' '}
              <Text style={{ fontWeight: 'normal' }}>
                {customer?.phone_number ?? 'নাম্বার নেই'}
              </Text>
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              তারিখঃ{' '}
              <Text style={{ fontWeight: 'normal' }}>{dateOfTheReport}</Text>
            </Text>
          </View>
          <View>
            <Text>
              মোট পরিশোধযোগ্যঃ{' '}
              <Text style={{ fontWeight: 'bold' }}>{total_payable_price}</Text>{' '}
              টাকা
            </Text>
            <Text>
              মোট ডাউনপেমেন্টঃ{' '}
              <Text style={{ fontWeight: 'bold' }}>{total_downpayment}</Text>{' '}
              টাকা
            </Text>
            <Text>
              কিস্তিতে মোট পরিশোধিতঃ{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {totalPaymentByCollection}
              </Text>{' '}
              টাকা
            </Text>
            <Text>
              মোট বাকি আছেঃ{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {total_remaining_payable}
              </Text>{' '}
              টাকা
            </Text>
            <Text>
              সাপ্তাহিক পরিশোধযোগ্যঃ{' '}
              <Text style={{ fontWeight: 'bold' }}>{totalWeeklyPayable}</Text>{' '}
              টাকা
            </Text>
          </View>
        </View>
        ''
        <View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: '20',
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            ক্রয়কৃত পণ্যের তালিকা
          </Text>
        </View>
        <View>
          {purchagedProducts?.map((item, index) => {
            return (
              <View
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  borderBottom: '1px solid #ccc',
                  fontSize: 10,
                }}
              >
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={{ fontWeight: 'bold' }}>পণ্যের নামঃ </Text>
                  <Text>{item?.product?.name}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={{ fontWeight: 'bold' }}>ক্রয়কৃত পরিমাণঃ </Text>
                  <Text>{item?.quantity} টি </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={{ fontWeight: 'bold' }}>মোটমূল্যঃ </Text>
                  <Text>{item?.total_payable_price} টাকা </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={{ fontWeight: 'bold' }}>বাকি আছেঃ </Text>
                  <Text>{item?.remaining_payable_price} টাকা </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View>
          {sameDayCollections?.length === 0 && (
            <Text style={{ textAlign: 'center', color: 'slategray' }}>
              কোনো পেমেন্ট নেই
            </Text>
          )}
          {sameDayCollections?.length > 0 && (
            <Text
              style={{
                textAlign: 'center',
                fontSize: '20',
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              কিস্তির তালিকা
            </Text>
          )}
          {sameDayCollections?.map((item, index) => {
            return (
              <View
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  borderBottom: '1px solid #ccc',
                  fontSize: 10,
                }}
              >
                <View>
                  <Text style={{ fontWeight: 'bold' }}>তারিখঃ </Text>
                  <Text>{sameDayCollections[index].createdAt}</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>কালেকশনযোগ্যঃ </Text>
                  <Text>
                    {sameDayCollections[index].totalCollectable} টাকা{' '}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>কালেকশন হয়েছেঃ </Text>
                  <Text>{sameDayCollections[index].totalCollected} টাকা </Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>বাকি আছেঃ </Text>
                  <Text>
                    {item?.totalCollectable - item?.totalCollected > 0
                      ? item?.totalCollectable - item?.totalCollected
                      : '0'}{' '}
                    টাকা{' '}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}

export default IndividualCustomerReport;
