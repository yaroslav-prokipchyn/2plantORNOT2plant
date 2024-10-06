import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const ReferenceETTimeSeries = ({ data }) => {
  const { t } = useTranslation();
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
    let value = d.reference_et;
    if (isImperial) {
      value = utils.toInches(value);
    }
    if (value < minValue) {
      minValue = value;
    }
  });
  let maxValue = -Infinity;
  time_series.forEach((d) => {
    let value = d.reference_et;
    if (isImperial) {
      value = utils.toInches(value);
    }
    if (value > maxValue) {
      maxValue = value;
    }
  });

  return (
    <Plot
      divId="reference-et-time-series"
      data={[
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) =>
              isImperial ? utils.toInches(d.reference_et) : d.reference_et
            )
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Reference ET"),
          line: {
            color: utils.colors[1],
          },
          showlegend: false,
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) =>
              isImperial ? utils.toInches(d.reference_et) : d.reference_et
            )
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Reference ET"),
          showlegend: false,
          line: {
            color: utils.colors[1],
            dash: "dot",
          },
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, minValue, maxValue)
          : []),
      ]}
      {...utils.plotProps(
        t("Reference ET"),
        isImperial ? t("inches/day") : t("mm/day"),
        mobile
      )}
    />
  );
};

export default ReferenceETTimeSeries;
