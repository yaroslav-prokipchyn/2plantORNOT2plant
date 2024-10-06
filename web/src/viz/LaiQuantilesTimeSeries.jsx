import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';

import * as utils from "./utils";

const LaiQuantilesTimeSeries = ({ data }) => {
  const { t } = useTranslation()
  let { data: time_series } = data;
  const { endDate } = useSelector((state) => state.form);
  const mobile = useMediaQuery("only screen and (max-width : 925px)");
  if (endDate !== null) {
    time_series = time_series.filter((d) => d.time <= endDate);
  }
  let minValue = Infinity;
  time_series.forEach((d) => {
    let value = Math.min(d.lai_masked_w, d.lai_masked_a, d.lai_masked_b);
    if (value < minValue) {
      minValue = value;
    }
  });
  let maxValue = -Infinity;
  time_series.forEach((d) => {
    let value = Math.max(d.lai_masked_w, d.lai_masked_a, d.lai_masked_b);
    if (value > maxValue) {
      maxValue = value;
    }
  });

  return (
    <Plot
      divId="lai-quantiles-time-series"
      data={[
        {
          x: time_series.map((d) => d.time),
          y: time_series.map((d) => d.lai_masked_b).map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Best"),
          line: {
            color: utils.colors[2],
          },
          showlegend: true,
        },
        {
          x: time_series.map((d) => d.time),
          y: time_series.map((d) => d.lai_masked_a).map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Average"),
          line: {
            color: utils.colors[1],
          },
          showlegend: true,
        },

        {
          x: time_series.map((d) => d.time),
          y: time_series.map((d) => d.lai_masked_w).map(utils.round),
          type: "scatter",
          mode: "lines",
          name: t("Worst"),
          line: {
            color: utils.colors[3],
          },
          showlegend: true,
        },
      ]}
      {...utils.plotProps(
        t("Leaf Area Index Variation Within Field"),
        t("Leaf Area Index"),
        mobile
      )}
    />
  );
};

export default LaiQuantilesTimeSeries;
