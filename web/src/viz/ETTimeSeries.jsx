import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const ETTimeSeries = ({ data }) => {
  const { t } = useTranslation()
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
  let twoWeekLine = 0.3;
  if (!isImperial) {
    twoWeekLine *= 25.4;
  }
  let maxValue = 0;
  time_series.forEach((d) => {
    let value = d.et_over;
    if (isImperial) {
      value /= 25.4;
    }
    if (value > maxValue) {
      maxValue = value;
    }
  });
  maxValue = Math.max(maxValue, twoWeekLine);
  const maxDate = utils.maxString(time_series.map((d) => d.time));
  const mouseover = (d) => {
    const dateString = new Date(d.time).toLocaleDateString();
    const etUpper = isImperial ? utils.toInches(d.et_over) : d.et_over;
    const et = isImperial ? utils.toInches(d.et_estimate) : d.et_estimate;
    const etLower = isImperial ? utils.toInches(d.et_under) : d.et_under;
    const unit = isImperial ? t("in") : t("mm");
    return `${t("Date")}: ${dateString}<br>${t("ET Upper Bound")}: ${etUpper.toFixed(
      2
    )} ${unit}<br>${t("ET")}: ${et.toFixed(
      2
    )} ${unit}<br>${t("ET Lower Bound")}: ${etLower.toFixed(2)} ${unit}`;
  };
  return (
    <Plot
      divId="et-time-series"
      data={[
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.et_over / 25.4 : d.et_over))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          line: {
            width: 0,
          },
          showlegend: false,
          name: t("ET Upper Bound"),
          hoverinfo: "none",
          marker: {
            color: utils.colors[1],
          },
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.et_under / 25.4 : d.et_under))
            .map(utils.round),
          fill: "tonexty",
          line: {
            width: 0,
          },
          showlegend: false,
          type: "scatter",
          mode: "lines",
          name: t("ET Lower Bound"),
          hoverinfo: "none",
          marker: {
            color: utils.colors[1],
          },
        },
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => (isImperial ? d.et_estimate / 25.4 : d.et_estimate))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          text: utils.observed(time_series, forecast_date).map(mouseover),
          hovertemplate: "%{text}<extra></extra>",
          name: t("ET"),
          marker: {
            color: utils.colors[1],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => (isImperial ? d.et_estimate / 25.4 : d.et_estimate))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          text: utils.predicted(time_series, forecast_date).map(mouseover),
          hovertemplate: "%{text}<extra></extra>",
          line: {
            dash: "dot",
          },
          name: t("ET"),
          showlegend: false,
          marker: {
            color: utils.colors[1],
          },
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map(() => twoWeekLine).map(utils.round),
          type: "scatter",
          mode: "lines",
          line: {
            color: "gray",
            width: 1.5,
            dash: "dot",
          },
          name: `${t("ET Replacement")}<br>${t("Warning")}`,
          text: time_series.map(
            () => t("Equipment may struggle to keep up with demand")
          ),
          hovertemplate: "%{text}<extra></extra>",
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, 0, utils.round(maxValue))
          : []),
      ]}
      {...utils.plotProps(
        t("Crop Water Use"),
        isImperial ? t("inches") : t("mm"),
        mobile
      )}
    />
  );
};

export default ETTimeSeries;
