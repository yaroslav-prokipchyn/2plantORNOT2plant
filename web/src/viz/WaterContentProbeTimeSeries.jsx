import { useSelector } from "react-redux";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const WaterContentProbeTimeSeries = ({ data }) => {
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
  const maxDate = utils.maxString(time_series.map((d) => d.time));
  let minValue = Infinity;
  time_series.forEach((d) => {
    let value = Math.min(
      d.swc_005cm,
      d.swc_015cm,
      d.swc_030cm,
      d.swc_060cm,
      d.fhc,
      d.wp
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
      d.swc_005cm,
      d.swc_015cm,
      d.swc_030cm,
      d.swc_060cm,
      d.fhc,
      d.wp
    );
    if (isImperial) {
      value /= 25.4;
    }
    if (value > maxValue) {
      maxValue = value;
    }
  });

  return (
    <Plot
      divId="water-content-probe-time-series"
      data={[
        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => (isImperial ? d.swc_005cm / 25.4 : d.swc_005cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `2 ${t("inches")}` : `50 ${t("mm")}`,
          line: {
            color: utils.colors[0],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => (isImperial ? d.swc_005cm / 25.4 : d.swc_005cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `2 ${t("inches")}` : `50 ${t("mm")}`,
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
            .map((d) => (isImperial ? d.swc_015cm / 25.4 : d.swc_015cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `6 ${t("inches")}` : `150 ${t("mm")}`,
          line: {
            color: utils.colors[1],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => (isImperial ? d.swc_015cm / 25.4 : d.swc_015cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `6 ${t("inches")}` : `150 ${t("mm")}`,
          showlegend: false,
          line: {
            color: utils.colors[1],
            dash: "dot",
          },
        },

        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => (isImperial ? d.swc_030cm / 25.4 : d.swc_030cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `12 ${t("inches")}` : `300 ${t("mm")}`,
          line: {
            color: utils.colors[2],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => (isImperial ? d.swc_030cm / 25.4 : d.swc_030cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `12 ${t("inches")}` : `300 ${t("mm")}`,
          showlegend: false,
          line: {
            color: utils.colors[2],
            dash: "dot",
          },
        },

        {
          x: utils.observed(time_series, forecast_date).map((d) => d.time),
          y: utils
            .observed(time_series, forecast_date)
            .map((d) => (isImperial ? d.swc_060cm / 25.4 : d.swc_060cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `24 ${t("inches")}` : `600 ${t("mm")}`,
          line: {
            color: utils.colors[3],
          },
        },
        {
          x: utils.predicted(time_series, forecast_date).map((d) => d.time),
          y: utils
            .predicted(time_series, forecast_date)
            .map((d) => (isImperial ? d.swc_060cm / 25.4 : d.swc_060cm))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          name: isImperial ? `24 ${t("inches")}` : `600 ${t("mm")}`,
          showlegend: false,
          line: {
            color: utils.colors[3],
            dash: "dot",
          },
        },

        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.wp / 25.4 : d.wp))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          line: {
            color: "gray",
            width: 1.5,
            dash: "dot",
          },
          name: t("Wilting Point"),
        },

        {
          x: time_series.map((d) => d.time),
          y: time_series
            .map((d) => (isImperial ? d.fhc / 25.4 : d.fhc))
            .map(utils.round),
          type: "scatter",
          mode: "lines",
          line: {
            color: "gray",
            width: 1.5,
            dash: "dot",
          },
          name: t("Field Holding Capacity"),
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
        t("Field Level Water Content Probe Simulation"),
        isImperial ? t("inches") : t("mm"),
        mobile
      )}
    />
  );
};

export default WaterContentProbeTimeSeries;
