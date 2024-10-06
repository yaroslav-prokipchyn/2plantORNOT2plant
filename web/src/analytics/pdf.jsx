import { Document, Image, Page, pdf, StyleSheet, Text, View, } from "@react-pdf/renderer";
import Plotly from "plotly.js-dist-min";
import { saveAs } from "file-saver";

const styles = StyleSheet.create({
  header: { color: "black", textAlign: "center", fontSize: 12, margin: 30 },
  sectionHeader: {
    color: "black",
    textAlign: "center",
    fontSize: 6,
    margin: 10,
  },
  image: {
    height: "1.255in",
  },
  colImage: {
    height: "2.33in",
  },
  row: {
    flexDirection: "row",
  },
  section: {
    marginLeft: "0.5in",
    marginRight: "0.5in",
    marginBottom: "0.25in",
  },
  column3: {
    width: "33%",
  },
  columnSpace: {
    width: "11%",
  },
});

const _imgRow = async (divId) => {
  const image = await Plotly.toImage(divId, {
    format: "png",
    width: 1494,
    height: 250,
  });
  return image;
};
const _imgBlock = async (divId) => {
  const image = await Plotly.toImage(divId, {
    format: "png",
    width: 482,
    height: 450,
  });
  return image;
};

export const onPdf = async (onFinish) => {
  let success = false;
  let attempts = 0;
  while (!success && attempts < 3) {
    try {
      const images = {
        precipitationBar: await _imgRow("precipitation-bar"),
        plantingWindowCategory: await _imgRow("planting-window-category"),
        riskMapsSaturation: await _imgBlock("risk-maps-saturation"),
        riskMapsSufficiency: await _imgBlock("risk-maps-sufficiency"),
        saturationRiskTimeSeries: await _imgRow("saturation-risk-time-series"),
        sufficiencyRiskTimeSeries: await _imgRow(
            "sufficiency-risk-time-series"
        ),
        seedZoneMoistureRanges: await _imgRow("seed-zone-moisture-ranges"),
        waterAvailableSurfacePresent: await _imgBlock(
            "water-available-surface-p1day"
        ),
        waterAvailableSurfaceForecast: await _imgBlock(
            "water-available-surface-f7day"
        ),
        fieldLevelMoistureRanges: await _imgRow("field-level-moisture-ranges"),
      };
      const blob = await pdf(<MyDocument images={images} />).toBlob();
      const timestamp = new Date().getTime();
      saveAs(blob, `report_${timestamp}.pdf`);
      success = true;
    } catch (error) {
      attempts += 1;
      console.warn(error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  if (!success) {
    console.error("Failed to generate PDF");
  }
  onFinish();
};

export const MyDocument = ({ images }) => {
  return (
      <Document>
        <Page size="A4">
          <View style={styles.header}>
            <Text>Planting Conditions</Text>
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.precipitationBar} />
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.plantingWindowCategory} />
          </View>
          <View style={styles.sectionHeader}>
            <Text>Risk Maps</Text>
          </View>
          <View style={[styles.row, styles.section]}>
            <View style={styles.columnSpace} />
            <View style={styles.column3}>
              <Image style={styles.colImage} src={images.riskMapsSaturation} />
            </View>
            <View style={styles.columnSpace} />
            <View style={styles.column3}>
              <Image style={styles.colImage} src={images.riskMapsSufficiency} />
            </View>
            <View style={styles.columnSpace} />
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.saturationRiskTimeSeries} />
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.sufficiencyRiskTimeSeries} />
          </View>
        </Page>
        <Page size="A4">
          <View style={styles.header}>
            <Text>Soil Moisture Content</Text>
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.precipitationBar} />
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.plantingWindowCategory} />
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.seedZoneMoistureRanges} />
          </View>
          <View style={styles.sectionHeader}>
            <Text>Soil Water Content Variability</Text>
          </View>
          <View style={[styles.row, styles.section]}>
            <View style={styles.columnSpace} />
            <View style={styles.column3}>
              <Image
                  style={styles.colImage}
                  src={images.waterAvailableSurfacePresent}
              />
            </View>
            <View style={styles.columnSpace} />
            <View style={styles.column3}>
              <Image
                  style={styles.colImage}
                  src={images.waterAvailableSurfaceForecast}
              />
            </View>
            <View style={styles.columnSpace} />
          </View>
          <View style={styles.section}>
            <Image style={styles.image} src={images.fieldLevelMoistureRanges} />
          </View>
        </Page>
      </Document>
  );
};
