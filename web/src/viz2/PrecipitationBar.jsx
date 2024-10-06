import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";

import * as utils from "./utils";

const PrecipitationBar = ({ data }) => {
  let { forecast_date, data: time_series } = data;
  const { units, endDate } = useSelector((state) => state.form);
  const mobile = useMediaQuery("only screen and (max-width : 925px)");

  const isImperial = units === "imperial";
  let forecastBox = true;
  if (endDate !== null) {
    time_series = time_series.filter((d) => d.time <= endDate);
    if (endDate < forecast_date) {
      forecastBox = false;
    }
  }
  let maxValue = 0;
  time_series.forEach((d) => {
    let value = Math.max(d.precipitation, d.irrigation);
    if (isImperial) {
      value /= 25.4;
    }
    if (value > maxValue) {
      maxValue = value;
    }
  });
  const maxDate = utils.maxString(time_series.map((d) => d.time));

  return (
    <Plot
      divId="precipitation-bar"
      data={[
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.precipitation / 25.4 : d.precipitation))
            .map(utils.round),
          type: "bar",
          name: "Precipitation",
          marker: {
            opacity: time_series.map((d) =>
              d.time < forecast_date ? 1.0 : 0.6
            ),
          },
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.irrigation / 25.4 : d.irrigation))
            .map(utils.round),
          type: "bar",
          name: "Irrigation",
          marker: {
            opacity: time_series.map((d) =>
              d.time < forecast_date ? 1.0 : 0.6
            ),
          },
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, 0, utils.round(maxValue))
          : []),
      ]}
      {...utils.plotProps(
        "Water Received",
        isImperial ? "inches" : "mm",
        mobile
      )}
    />
  );
};

export default PrecipitationBar;
