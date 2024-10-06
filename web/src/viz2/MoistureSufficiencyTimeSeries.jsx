import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";

import * as utils from "./utils";

const MoistureSufficiencyTimeSeries = ({ data }) => {
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
      divId="moisture-sufficiency-time-series"
      data={[
        {
          x: time_series.map((d) => d.time),
          y: time_series.map((d) => d.moisture_sufficiency).map(utils.round),
          type: "scatter",
          mode: "lines",
          name: "Moisture Sufficiency",
          line: {
            color: utils.colors[0],
          },
          showlegend: false,
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => 0),
          fill: "tonexty",
          fillcolor: "rgba(31, 119, 180, 0.3)",
          line: {
            width: 0,
          },
          name: "Moisture Sufficiency",
          showlegend: false,
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, 0, 100)
          : []),
      ]}
      {...utils.plotProps("Moisture Sufficiency", undefined, mobile)}
    />
  );
};

export default MoistureSufficiencyTimeSeries;
