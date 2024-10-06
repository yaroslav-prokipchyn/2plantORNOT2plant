import { Col, Row } from "antd";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const LEVELS = [0, 1, 2, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];
const colorscale = [
  [0, "rgb(243, 251, 189)"],
  [0.125, "rgb(243, 251, 189)"],
  [0.125, "rgb(215, 239, 163)"],
  [0.25, "rgb(215, 239, 163)"],
  [0.25, "rgb(172, 220, 142)"],
  [0.375, "rgb(172, 220, 142)"],
  [0.375, "rgb(120, 197, 120)"],
  [0.5, "rgb(120, 197, 120)"],
  [0.5, "rgb(93, 184, 107)"],
  [0.5625, "rgb(93, 184, 107)"],
  [0.5625, "rgb(69, 169, 93)"],
  [0.625, "rgb(69, 169, 93)"],
  [0.625, "rgb(50, 151, 80)"],
  [0.6875, "rgb(50, 151, 80)"],
  [0.6875, "rgb(34, 134, 69)"],
  [0.75, "rgb(34, 134, 69)"],
  [0.75, "rgb(18, 118, 61)"],
  [0.8125, "rgb(18, 118, 61)"],
  [0.8125, "rgb(6, 103, 55)"],
  [0.875, "rgb(6, 103, 55)"],
  [0.875, "rgb(1, 86, 48)"],
  [0.9375, "rgb(1, 86, 48)"],
  [0.9375, "rgb(0, 69, 41)"],
  [1, "rgb(0, 69, 41)"],
];

const LaiMaps = ({ data }) => {
  const { t }= useTranslation();
  let {
    times,
    data: { aoi_lon, aoi_lat, past_14days, past_7days, today, lon, lat },
  } = data;
  const mobile = useMediaQuery("only screen and (max-width : 925px)");

  return (
    <>
      <Row justify="center">
        <p style={{ font: "Arial", fontSize: mobile ? 8 : 17 }}>
          {t('Field Health Variability')}
        </p>
      </Row>
      <Row>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="lai-maps-p14day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_14days,
                  type: "heatmap",
                  colorscale,
                  name: t("LAI"),
                  hovertemplate: "%{z:.2f}<extra></extra>",
                  zmin: 0,
                  zmax: 8,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: LEVELS,
                    title: t("Leaf Area Index"),
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
              {...utils.plotProps2d(`${t("Last Week")}: ${times[0]}`, mobile)}
            />
          </Row>
        </Col>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="lai-maps-p7day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_7days,
                  type: "heatmap",
                  colorscale,
                  name: t("LAI"),
                  hovertemplate: "%{z:.2f}<extra></extra>",
                  zmin: 0,
                  zmax: 8,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: LEVELS,
                    title: t("Leaf Area Index"),
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
              {...utils.plotProps2d(`${t("Current")}: ${times[1]}`, mobile)}
            />
          </Row>
        </Col>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="lai-maps-today"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: today,
                  type: "heatmap",
                  colorscale,
                  name: t("LAI"),
                  hovertemplate: "%{z:.2f}<extra></extra>",
                  zmin: 0,
                  zmax: 8,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: LEVELS,
                    title: t("Leaf Area Index"),
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
              {...utils.plotProps2d(`${t("Forecast")}: ${times[2]}`, mobile)}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default LaiMaps;
