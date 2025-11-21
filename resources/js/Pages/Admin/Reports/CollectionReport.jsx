import { dateFormatter } from '@/utilityFuntion';

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

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

function CollectionReport({ collections }) {
  return (
    <Document>
      <Page title="কালেকশন রিপোর্ট" style={styles.page}>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            {'\u200B'} Collection Report {'\u200B'}
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            আজকের তারিখঃ{' '}
            <Text style={{ fontWeight: 'normal' }}>
              {dateFormatter(new Date())}
            </Text>
          </Text>
          <Text style={{ fontWeight: 'bold' }}>
            কালেকশনের তারিখঃ{' '}
            <Text style={{ fontWeight: 'normal' }}>
              {dateFormatter(collections[0].createdAt)}
            </Text>
          </Text>
        </View>
        <View style={{ fontSize: 10 }}>
          {collections.map((collection, index) => {
            return (
              <View
                key={collection?.customer?.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #ccc',
                  paddingTop: 8,
                }}
              >
                <View>
                  <Text style={{ fontWeight: 'bold' }}>কাস্টমারের নামঃ </Text>
                  <Text>{collection?.customer?.name}</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>ঠিকানাঃ </Text>
                  <Text>{collection?.customer?.address}</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>
                    সাপ্তাহিক পরিশোধযোগ্যঃ{' '}
                  </Text>
                  <Text>{collection?.totalWeeklyCollectableAmount} টাকা</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>
                    সাপ্তাহিক কালেকশনঃ{' '}
                  </Text>
                  <Text>{collection?.totalWeeklyCollectedAmount} টাকা</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
export default CollectionReport;
