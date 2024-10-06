import { Col, Row } from "antd";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";

import * as utils from "./utils";

const colorscale1 = [
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

const colorscale2 = [
  [0, "rgb(165, 0, 38)"],
  [0.1, "rgb(165, 0, 38)"],
  [0.1, "rgb(214, 47, 39)"],
  [0.2, "rgb(214, 47, 39)"],
  [0.2, "rgb(244, 109, 67)"],
  [0.3, "rgb(244, 109, 67)"],
  [0.3, "rgb(253, 173, 96)"],
  [0.4, "rgb(253, 173, 96)"],
  [0.4, "rgb(254, 224, 139)"],
  [0.5, "rgb(254, 224, 139)"],
  [0.5, "rgb(255, 254, 190)"],
  [0.6, "rgb(255, 254, 190)"],
  [0.6, "rgb(217, 239, 139)"],
  [0.7, "rgb(217, 239, 139)"],
  [0.7, "rgb(165, 216, 106)"],
  [0.8, "rgb(165, 216, 106)"],
  [0.8, "rgb(102, 189, 99)"],
  [0.9, "rgb(102, 189, 99)"],
  [0.9, "rgb(25, 151, 80)"],
  [1, "rgb(25, 151, 80)"],
];

const RiskMaps = ({ data }) => {
  let {
    data: { aoi_lat, aoi_lon, saturation, sufficiency, lat, lon, time },
  } = data;
  const mobile = useMediaQuery("only screen and (max-width : 925px)");
  time = time.split("T")[0];

  return (
    <>
      <Row justify="center">
        <p style={{ font: "Arial", fontSize: mobile ? 8 : 17 }}>Risk Maps</p>
      </Row>
      <Row>
        <Col xs={12} md={8} offset={mobile ? 0 : 4}>
          <Row justify="center">
            <Plot
              divId="risk-maps-saturation"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: saturation,
                  type: "heatmap",
                  colorscale: colorscale1,
                  name: "Risk %",
                  hovertemplate: "%{z:.0f}%<extra></extra>",
                  zmin: 0,
                  zmax: 100,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    tickformat: ".0f",
                    title: "Saturation Risk %",
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
              {...utils.plotProps2d(
                `Subfield Soil Moisture: Is it too wet to plant?<br />Date: ${time}`,
                mobile
              )}
            />
          </Row>
        </Col>
        <Col xs={12} md={8}>
          <Row justify="center">
            <Plot
              divId="risk-maps-sufficiency"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: sufficiency,
                  type: "heatmap",
                  colorscale: colorscale2,
                  name: "Water Sufficiency %",
                  hovertemplate: "%{z:.0f}%<extra></extra>",
                  zmin: 0,
                  zmax: 100,
                  showscale: !mobile,
                  colorbar: {
                    tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    tickformat: ".0f",
                    title: "Water Sufficiency %",
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
              {...utils.plotProps2d(
                `Subfield Germination: Is there enough water for germination?<br />Date: ${time}`,
                mobile
              )}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default RiskMaps;
