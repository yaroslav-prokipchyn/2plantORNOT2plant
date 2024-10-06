import React from "react";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import percentile from "percentile";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const colorscale = [
  [0, "rgb(247, 251, 255)"],
  [0.5, "rgb(109, 174, 213)"],
  [1, "rgb(8, 48, 107)"],
];

const WaterAvailableSurface = ({ data }) => {
  const { t } = useTranslation()
  let {
    times,
    data: { lon, lat, past_7day, past_1day, future_7day },
  } = data;
  const isImperial = useSelector((state) => state.form.units === "imperial");
  const mobile = useMediaQuery("only screen and (max-width : 925px)");

  return (
    <>
      <Row justify="center">
        <p style={{ font: "Arial", fontSize: mobile ? 8 : 17 }}>
          {t("Soil Water Content Variability")}
        </p>
      </Row>
      <Row>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="water-available-surface-p7day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_7day.map((row) =>
                    row.map((z) => (isImperial ? utils.toInches(z) : z))
                  ),
                  type: "surface",
                  name: t("Water Available"),
                  zhoverformat: ".2f",
                  colorscale,
                  showscale: !mobile,
                  colorbar: {
                    tickformat: ".1f",
                    title: `${t("Water Available")} (${isImperial ? t("in") : t("mm")})`,
                    titleside: "right",
                  },
                  hoverinfo: "z",
                },
                {
                  x: [(Math.max(...lon) + Math.min(...lon)) / 2],
                  y: [Math.max(...lat)],
                  z: [
                    percentile(
                      75,
                      past_7day
                        .map((row) =>
                          row.map((z) => (isImperial ? utils.toInches(z) : z))
                        )
                        .flat()
                    ),
                  ],
                  mode: "text",
                  type: "scatter3d",
                  text: "N",
                },
              ]}
              {...utils.plotPropsSurface(`${t("Last Week")}: ${times[0]}`, mobile)}
            />
          </Row>
        </Col>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="water-available-surface-p1day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: past_1day.map((row) =>
                    row.map((z) => (isImperial ? utils.toInches(z) : z))
                  ),
                  type: "surface",
                  name: t("Water Available"),
                  zhoverformat: ".2f",
                  colorscale,
                  showscale: !mobile,
                  colorbar: {
                    tickformat: ".1f",
                    title: `${t("Water Available")} (${isImperial ? t("in") : t("mm")})`,
                    titleside: "right",
                  },
                  hoverinfo: "z",
                },
                {
                  x: [(Math.max(...lon) + Math.min(...lon)) / 2],
                  y: [Math.max(...lat)],
                  z: [
                    percentile(
                      75,
                      past_1day
                        .map((row) =>
                          row.map((z) => (isImperial ? utils.toInches(z) : z))
                        )
                        .flat()
                    ),
                  ],
                  mode: "text",
                  type: "scatter3d",
                  text: "N",
                },
              ]}
              {...utils.plotPropsSurface(`${t("Current")}: ${times[1]}`, mobile)}
            />
          </Row>
        </Col>
        <Col xs={8}>
          <Row justify="center">
            <Plot
              divId="water-available-surface-f7day"
              data={[
                {
                  x: lon,
                  y: lat,
                  z: future_7day.map((row) =>
                    row.map((z) => (isImperial ? utils.toInches(z) : z))
                  ),
                  type: "surface",
                  name: t("Water Available"),
                  zhoverformat: ".2f",
                  colorscale,
                  showscale: !mobile,
                  colorbar: {
                    tickformat: ".1f",
                    title: `${t("Water Available")} (${isImperial ? t("in") : t("mm")})`,
                    titleside: "right",
                  },
                  hoverinfo: "z",
                },
                {
                  x: [(Math.max(...lon) + Math.min(...lon)) / 2],
                  y: [Math.max(...lat)],
                  z: [
                    percentile(
                      75,
                      future_7day
                        .map((row) =>
                          row.map((z) => (isImperial ? utils.toInches(z) : z))
                        )
                        .flat()
                    ),
                  ],
                  mode: "text",
                  type: "scatter3d",
                  text: "N",
                },
              ]}
              {...utils.plotPropsSurface(`${t("Forecast")}: ${times[2]}`, mobile)}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default WaterAvailableSurface;
