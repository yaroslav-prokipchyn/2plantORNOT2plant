import { Col, Row } from "antd";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const colorscale = [
  [0, "rgb(239, 249, 189)"],
  [0.1, "rgb(239, 249, 189)"],
  [0.1, "rgb(213, 238, 179)"],
  [0.2, "rgb(213, 238, 179)"],
  [0.2, "rgb(169, 221, 183)"],
  [0.3, "rgb(169, 221, 183)"],
  [0.3, "rgb(115, 201, 189)"],
  [0.4, "rgb(115, 201, 189)"],
  [0.4, "rgb(69, 180, 194)"],
  [0.5, "rgb(69, 180, 194)"],
  [0.5, "rgb(40, 151, 191)"],
  [0.6, "rgb(40, 151, 191)"],
  [0.6, "rgb(32, 115, 178)"],
  [0.7, "rgb(32, 115, 178)"],
  [0.7, "rgb(35, 78, 160)"],
  [0.8, "rgb(35, 78, 160)"],
  [0.8, "rgb(28, 49, 133)"],
  [0.9, "rgb(28, 49, 133)"],
  [0.9, "rgb(8, 29, 88)"],
  [1, "rgb(8, 29, 88)"],
];

const LeachingRiskMaps = ({ data }) => {
  const { t } = useTranslation()
  let {
    times,
    data: { aoi_lat, aoi_lon, future_7day, past_1day, past_7day, lat, lon },
  } = data;
  const mobile = useMediaQuery("only screen and (max-width : 925px)");

  return (
    <>
      <Row justify="center">
        <p style={{ font: "Arial", fontSize: mobile ? 8 : 17 }}>
          {t("Leaching Risk Variability")} 
        </p>
      </Row>
      <Row>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="leaching-risk-maps-p7day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_7day,
                  type: "heatmap",
                  colorscale,
                  name: t("Risk %"),
                  hovertemplate: "%{z:.0f}%<extra></extra>",
                  zmin: 0,
                  zmax: 100,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    tickformat: ".0f",
                    title: t("Leaching Risk %"),
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
              divId="leaching-risk-maps-p1day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_1day,
                  type: "heatmap",
                  colorscale,
                  name: t("Risk %"),
                  hovertemplate: "%{z:.0f}%<extra></extra>",
                  zmin: 0,
                  zmax: 100,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    tickformat: ".0f",
                    title: t("Leaching Risk %"),
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
              divId="leaching-risk-maps-f7day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: future_7day,
                  type: "heatmap",
                  colorscale,
                  name: t("Risk %"),
                  hovertemplate: "%{z:.0f}%<extra></extra>",
                  zmin: 0,
                  zmax: 100,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    tickformat: ".0f",
                    title: t("Leaching Risk %"),
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

export default LeachingRiskMaps;
