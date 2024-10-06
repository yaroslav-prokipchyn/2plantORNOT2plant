import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const colorscale = [
  [0, "rgb(254, 229, 204)"],
  [0.125, "rgb(254, 229, 204)"],
  [0.125, "rgb(253, 206, 160)"],
  [0.25, "rgb(253, 206, 160)"],
  [0.25, "rgb(253, 174, 108)"],
  [0.375, "rgb(253, 174, 108)"],
  [0.375, "rgb(251, 141, 61)"],
  [0.5, "rgb(251, 141, 61)"],
  [0.5, "rgb(239, 106, 23)"],
  [0.625, "rgb(239, 106, 23)"],
  [0.625, "rgb(213, 75, 4)"],
  [0.75, "rgb(213, 75, 4)"],
  [0.75, "rgb(168, 55, 3)"],
  [0.875, "rgb(168, 55, 3)"],
  [0.875, "rgb(127, 39, 4)"],
  [1, "rgb(127, 39, 4)"],
];

const ETMaps = ({ data }) => {
  const { t } = useTranslation();
  let {
    zmax_7day,
    zmin_7day,
    ticks_7day,
    zmax_3day,
    zmin_3day,
    ticks_3day,
    data: { aoi_lat, aoi_lon, past_3day, past_7day, lat, lon },
  } = data;
  const isImperial = useSelector((state) => state.form.units === "imperial");
  const mobile = useMediaQuery("only screen and (max-width : 925px)");

  return (
    <>
      <Row justify="center">
        <p style={{ font: "Arial", fontSize: mobile ? 8 : 17 }}>
          {t("Crop Water Use Variability")}
        </p>
      </Row>
      <Row>
        <Col xs={12} md={8} offset={mobile ? 0 : 4}>
          <Row justify="center">
            <Plot
              divId="et-maps-p7day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_7day.map((row) =>
                    row.map((z) => (isImperial ? utils.toInches(z) : z))
                  ),
                  type: "heatmap",
                  colorscale,
                  name: t("ET"),
                  hovertemplate: "ET: %{z:.2f}<extra></extra>",
                  zmin: isImperial ? utils.toInches(zmin_7day) : zmin_7day,
                  zmax: isImperial ? utils.toInches(zmax_7day) : zmax_7day,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: isImperial
                      ? ticks_7day.map(utils.toInches)
                      : ticks_7day,
                    tickformat: ".2f",
                    title: isImperial ? t("ET in") : t("ET mm"),
                    titleside: "right",
                  },
                },
                {
                  x: aoi_lon,
                  y: aoi_lat,
                  mode: "lines",
                  line: {
                    color: utils.colors[0],
                    width: 3,
                  },
                  name: t("AOI"),
                  hoverinfo: "none",
                },
              ]}
              {...utils.plotProps2d(t('Last Days', { value: 7 }), mobile)}
            />
          </Row>
        </Col>
        <Col xs={12} md={8}>
          <Row justify="center">
            <Plot
              divId="et-maps-p3day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_3day.map((row) =>
                    row.map((z) => (isImperial ? utils.toInches(z) : z))
                  ),
                  type: "heatmap",
                  colorscale,
                  name: t("ET"),
                  hovertemplate: `${t("ET")}: %{z:.2f}<extra></extra>`,
                  zmin: isImperial ? utils.toInches(zmin_3day) : zmin_3day,
                  zmax: isImperial ? utils.toInches(zmax_3day) : zmax_3day,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: isImperial
                      ? ticks_3day.map(utils.toInches)
                      : ticks_3day,
                    tickformat: ".2f",
                    title: isImperial ? t("ET in") : t("ET mm"),
                    titleside: "right",
                  },
                },
                {
                  x: aoi_lon,
                  y: aoi_lat,
                  mode: "lines",
                  line: {
                    color: utils.colors[0],
                    width: 3,
                  },
                  name: t("AOI"),
                  hoverinfo: "none",
                },
              ]}
              {...utils.plotProps2d(t('Last Days', { value: 3 }), mobile)}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ETMaps;
