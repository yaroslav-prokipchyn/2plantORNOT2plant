import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const WaterRisksTimeSeries = ({ data }) => {
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

  return (
    <Plot
      divId="water-risks-time-series"
      data={[
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => d.leach_risk)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Leaching"),
          line: {
            color: utils.colors[0],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => d.leach_risk)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Leaching"),
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
            .map((d) => d.water_risk)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Drought"),
          line: {
            color: utils.colors[1],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => d.water_risk)
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Drought"),
          showlegend: false,
          line: {
            color: utils.colors[1],
            dash: "dot",
          },
        },
        ...(forecastBox
          ? utils.forecastBox(forecast_date, maxDate, 0, 100)
          : []),
      ]}
      {...utils.plotProps(t("Leaching & Drought Risk"), "%", mobile)}
    />
  );
};

export default WaterRisksTimeSeries;
