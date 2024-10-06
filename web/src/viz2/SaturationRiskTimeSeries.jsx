import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";

import * as utils from "./utils";

const SaturationRiskTimeSeries = ({ data }) => {
  let { forecast_date, data: time_series } = data;
  const { endDate } = useSelector((state) => state.form);
  const mobile = useMediaQuery("only screen and (max-width : 925px)");
  let forecastBox = true;
  if (endDate !== null) {
    time_series = time_series.filter((d) => d.time <= endDate);
    if (endDate < forecast_date) {
      forecastBox = false;
    }
  }
  const maxDate = utils.maxString(time_series.map((d) => d.time));

  return (
    <Plot
      divId="saturation-risk-time-series"
      data={[
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 100),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 75),
          fill: "tonexty",
          fillcolor: "rgba(31, 119, 180, 0.6)",
          line: {
            width: 0,
          },
          name: "High risk for saturation",
          showlegend: true,
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 75),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 50),
          fill: "tonexty",
          fillcolor: "rgba(31, 119, 180, 0.3)",
          line: {
            width: 0,
          },
          name: "Increased risk for saturation",
          showlegend: true,
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => d.saturation_015cm)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: "Daily soil saturation risk %",
          line: {
            color: utils.colors[3],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => d.saturation_015cm)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: "Daily soil saturation risk %",
          showlegend: false,
          line: {
            color: utils.colors[3],
            dash: "dot",
          },
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, 0, 100)
          : []),
      ]}
      {...utils.plotProps(
        "Field Level Soil Moisture: Is it too wet to plant?",
        "%",
        mobile
      )}
    />
  );
};

export default SaturationRiskTimeSeries;
