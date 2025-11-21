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
      </Page>
    </Document>
  );
}
export default CollectionReport;
