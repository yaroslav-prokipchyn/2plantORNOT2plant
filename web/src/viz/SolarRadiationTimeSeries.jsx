import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const SolarRadiationTimeSeries = ({ data }) => {
  const { t } = useTranslation()
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
  let minValue = Infinity;
  time_series.forEach((d) => {
    let value = d.solar_radiation;
    if (value < minValue) {
      minValue = value;
    }
  });
  let maxValue = -Infinity;
  time_series.forEach((d) => {
    let value = d.solar_radiation;
    if (value > maxValue) {
      maxValue = value;
    }
  });

  return (
    <Plot
      divId="solar-radiation-time-series"
      data={[
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => d.solar_radiation)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Solar Radiation"),
          line: {
            color: utils.colors[1],
          },
          showlegend: false,
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => d.solar_radiation)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Solar Radiation"),
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
      {...utils.plotProps(t("Solar Radiation"), t("MJ/m^2"), mobile)}
    />
  );
};

export default SolarRadiationTimeSeries;
