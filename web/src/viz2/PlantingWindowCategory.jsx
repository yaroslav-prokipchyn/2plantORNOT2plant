import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";

import * as utils from "./utils";

const PlantingWindowCategory = ({ data }) => {
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
  const maxValue = 100;
  const maxDate = utils.maxString(time_series.map((d) => d.time));

  const colors = [
    null,
    "rgba(24, 128, 33, 0.6)",
    "rgba(255, 127, 14, 0.6)",
    "rgba(179, 98, 0, 0.6)",
    "rgba(255, 1, 0, 0.6)",
  ];

  const mouseover = (d) => {
    const dateString = new Date(d.time).toLocaleDateString();
    if (d.planting_window === null) {
      return null;
    }
    const condition = ["", "Best", "Good", "Fair", "Poor"][d.planting_window];
    return `Date: ${dateString}<br>Condition: ${condition}`;
  };

  return (
    <Plot
      divId="planting-window-category"
      data={[
        {
          x: time_series.map((d) => d.time),
          y: time_series.map((d) => (d.planting_window !== null ? 100 : null)),
          type: "bar",
          marker: {
            color: time_series.map((d) => colors[d.planting_window]),
          },
          showlegend: false,
          hovertext: time_series.map(mouseover),
          hovertemplate: "%{hovertext}<extra></extra>",
        },
        {
          x: [null],
          y: [null],
          type: "bar",
          name: "Best",
          marker: {
            color: colors[1],
          },
        },
        {
          x: [null],
          y: [null],
          type: "bar",
          name: "Good",
          marker: {
            color: colors[2],
          },
        },
        {
          x: [null],
          y: [null],
          type: "bar",
          name: "Fair",
          marker: {
            color: colors[3],
          },
        },
        {
          x: [null],
          y: [null],
          type: "bar",
          name: "Poor",
          marker: {
            color: colors[4],
          },
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, 0, utils.round(maxValue))
          : []),
      ]}
      {...utils.plotPropsCategory("Planting Conditions", mobile)}
    />
  );
};

export default PlantingWindowCategory;
