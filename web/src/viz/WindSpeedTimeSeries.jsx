import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const WindSpeedTimeSeries = ({ data }) => {
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
    let value = d.min_wind_speed;
    if (isImperial) {
      value = utils.toMph(value);
    }
    if (value < minValue) {
      minValue = value;
    }
  });
  let maxValue = -Infinity;
  time_series.forEach((d) => {
    let value = d.max_wind_speed;
    if (isImperial) {
      value = utils.toMph(value);
    }
    if (value > maxValue) {
      maxValue = value;
    }
  });

  return (
    <Plot
      divId="wind-speed-time-series"
      data={[
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) =>
              isImperial ? utils.toMph(d.min_wind_speed) : d.min_wind_speed
            )
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Min Wind Speed"),
          line: {
            color: utils.colors[0],
          },
          showlegend: false,
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) =>
              isImperial ? utils.toMph(d.min_wind_speed) : d.min_wind_speed
            )
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Min Wind Speed"),
          showlegend: false,
          line: {
            color: utils.colors[0],
            dash: "dot",
          },
        },
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) =>
              isImperial ? utils.toMph(d.max_wind_speed) : d.max_wind_speed
            )
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Max Wind Speed"),
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
              isImperial ? utils.toMph(d.max_wind_speed) : d.max_wind_speed
            )
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Max Wind Speed"),
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
        t("Min/Max Wind Speed"),
        isImperial ? t("mph") : t("m/s"),
        mobile
      )}
    />
  );
};

export default WindSpeedTimeSeries;
