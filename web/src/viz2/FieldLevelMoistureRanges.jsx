import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";

import * as utils from "./utils";

const FieldLevelMoistureRanges = ({ data }) => {
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
  const maxDate = utils.maxString(time_series.map((d) => d.time));
  let minValue = Infinity;
  time_series.forEach((d) => {
    let value = Math.min(
      d.wp === null ? Infinity : d.wp,
      d.swc_sig_under === null ? Infinity : d.swc_sig_under
    );
    if (isImperial) {
      value /= 25.4;
    }
    if (value < minValue) {
      minValue = value;
    }
  });
  let maxValue = -Infinity;
  time_series.forEach((d) => {
    let value = Math.max(
      d.fhc === null ? -Infinity : d.fhc,
      d.swc_sig_over === null ? -Infinity : d.swc_sig_over
    );
    if (isImperial) {
      value /= 25.4;
    }
    if (value > maxValue) {
      maxValue = value;
    }
  });

  const mouseover = (d) => {
    const dateString = new Date(d.time).toLocaleDateString();
    const swc = isImperial ? d.swc_est / 25.4 : d.swc_est;
    const unit = isImperial ? "in" : "mm";
    return `Date: ${dateString}<br>SWC: ${swc.toFixed(2)} ${unit}`;
  };
  return (
    <Plot
      divId="field-level-moisture-ranges"
      data={[
        // Top Band
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.fhc / 25.4 : d.fhc))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
          hoverinfo: "none",
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.rtsml_t / 25.4 : d.rtsml_t))
            .map(utils.round),
          fill: "tonexty",
          fillcolor: "rgba(63, 189, 173, 0.3)",
          line: {
            width: 0,
          },
          name: "Nearing Saturation",
          showlegend: true,
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        // Middle Band
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.rtsml_t / 25.4 : d.rtsml_t))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
          hoverinfo: "none",
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.rtsml_b / 25.4 : d.rtsml_b))
            .map(utils.round),
          fill: "tonexty",
          fillcolor: "rgba(44, 160, 44, 0.3)",
          line: {
            width: 0,
          },
          name: "Optimal",
          showlegend: true,
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        // Bottom Band
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.rtsml_b / 25.4 : d.rtsml_b))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
          hoverinfo: "none",
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.wp / 25.4 : d.wp))
            .map(utils.round),
          fill: "tonexty",
          fillcolor: "rgba(255, 127, 14, 0.3)",
          line: {
            width: 0,
          },
          name: "Nearing Depletion",
          showlegend: true,
          type: "scatter",
          mode: "lines",
          hoverinfo: "none",
        },
        {
          x: time_series
            .filter((d) => d.swc_sig_over !== null)
            .map((d) => d.time),
          y: time_series
            .filter((d) => d.swc_sig_over !== null)
            .map((d) => (isImperial ? d.swc_sig_over / 25.4 : d.swc_sig_over))
            .map(utils.round),
          text: time_series.filter((d) => d.swc_est !== null).map(mouseover),
          hovertemplate: "%{text}<extra></extra>",
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
          name: "SWC Upper Bound",
          marker: {
            color: utils.colors[0],
          },
        },
        {
          x: time_series
            .filter((d) => d.swc_sig_under !== null)
            .map((d) => d.time),
          y: time_series
            .filter((d) => d.swc_sig_under !== null)
            .map((d) => (isImperial ? d.swc_sig_under / 25.4 : d.swc_sig_under))
            .map(utils.round),
          text: time_series.filter((d) => d.swc_est !== null).map(mouseover),
          hovertemplate: "%{text}<extra></extra>",
          fill: "tonexty",
          line: {
            width: 0,
          },
          type: "scatter",
          mode: "lines",
          name: "Uncertainty",
          legendrank: 999,
          marker: {
            color: utils.colors[0],
          },
        },
        {
          x: utils
            .observed(time_series, forecast_date)
            .filter((d) => d.swc_est !== null)
            .map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .filter((d) => d.swc_est !== null)
            .map((d) => (isImperial ? d.swc_est / 25.4 : d.swc_est))
            .map(utils.round),
          text: utils
            .observed(time_series, forecast_date)
            .filter((d) => d.swc_est !== null)
            .map(mouseover),
          hovertemplate: "%{text}<extra></extra>",
          name: "Soil Water Content",
          legendrank: 998,
          line: { color: utils.colors[0] },
        },
        {
          x: utils
            .predicted(time_series, forecast_date)
            .filter((d) => d.swc_est !== null)
            .map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .filter((d) => d.swc_est !== null)
            .map((d) => (isImperial ? d.swc_est / 25.4 : d.swc_est))
            .map(utils.round),
          text: utils
            .predicted(time_series, forecast_date)
            .filter((d) => d.swc_est !== null)
            .map(mouseover),
          hovertemplate: "%{text}<extra></extra>",
          name: "SWC",
          showlegend: false,
          line: { dash: "dot", color: utils.colors[0] },
        },
        ...(forecastBox
          ? utils.forecastBox(
              forecast_date,
              maxDate,
              utils.round(minValue),
              utils.round(maxValue)
            )
          : []),
      ]}
      {...utils.plotProps(
        `Field Level Soil Water Content`,
        isImperial ? "inches" : "mm",
        mobile
      )}
    />
  );
};

export default FieldLevelMoistureRanges;
