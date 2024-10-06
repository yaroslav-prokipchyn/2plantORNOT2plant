import { Col, Row } from "antd";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const colors = [
  "rgb(25, 151, 80)",
  "rgb(102, 189, 99)",
  "rgb(165, 216, 106)",
  "rgb(217, 239, 139)",
  "rgb(255, 254, 190)",
  "rgb(254, 224, 139)",
  "rgb(253, 173, 96)",
  "rgb(244, 109, 67)",
  "rgb(214, 47, 39)",
  "rgb(165, 0, 38)",
];

const WaterShortageMaps = ({ data }) => {
  const { t } = useTranslation()
  let {
    times,
    data: { aoi_lat, aoi_lon, future_7day, past_1day, past_7day, lat, lon },
  } = data;
  const mobile = useMediaQuery("only screen and (max-width : 925px)");

  const colorscale = [];
  for (let i = 1; i <= 10; i += 1) {
    colorscale.push([(i - 1) / 10, colors[i - 1]]);
    colorscale.push([i / 10, colors[i - 1]]);
  }

  return (
    <>
      <Row justify="center">
        <p style={{ font: "Arial", fontSize: mobile ? 8 : 17 }}>
          {t("Drought Risk Variability")}
        </p>
      </Row>
      <Row>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="water-shortage-maps-p7day"
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
                    title: t("Water Shortage Risk %"),
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
              divId="water-shortage-maps-p1day"
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
                    title: t("Water Shortage Risk %"),
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
              divId="water-shortage-maps-f7day"
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
                    title: t("Water Shortage Risk %"),
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
                  name: "AOI",
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

export default WaterShortageMaps;
