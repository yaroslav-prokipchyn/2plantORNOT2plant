import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";

import * as utils from "./utils";

const SufficiencyRiskTimeSeries = ({ data }) => {
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
      divId="sufficiency-risk-time-series"
      data={[
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 25),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 0),
          fill: "tonexty",
          fillcolor: "rgba(255, 0, 0, 0.6)",
          line: {
            width: 0,
          },
          name: "High risk for insufficient moisture",
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 50),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 25),
          fill: "tonexty",
          fillcolor: "rgba(255, 0, 0, 0.3)",
          line: {
            width: 0,
          },
          name: "Increased risk for insufficient moisture",
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => d.sufficiency)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: "Daily water sufficiency %",
          line: {
            color: utils.colors[0],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => d.sufficiency)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: "Daily water sufficiency %",
          showlegend: false,
          line: {
            color: utils.colors[0],
            dash: "dot",
          },
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, 0, 100)
          : []),
      ]}
      {...utils.plotProps(
        "Field Level Germination: Is there enough water for germination?",
        "%",
        mobile
      )}
    />
  );
};

export default SufficiencyRiskTimeSeries;
