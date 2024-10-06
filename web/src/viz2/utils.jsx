export const colors = [
  "#1f77b4", // muted blue
  "#ff7f0e", // safety orange
  "#2ca02c", // cooked asparagus green
  "#d62728", // brick red
  "#9467bd", // muted purple
  "#8c564b", // chestnut brown
  "#e377c2", // raspberry yogurt pink
  "#7f7f7f", // middle gray
  "#bcbd22", // curry yellow-green
  "#17becf", // blue-teal
];

export const round = (number) =>
  Math.round((number + Number.EPSILON) * 100) / 100;

export const maxString = (arr) => {
  if (!arr) {
    return null;
  }
  let maxV = arr[0];
  arr.forEach((a) => {
    if (a > maxV) maxV = a;
  });
  return maxV;
};

export const forecastBox = (forecastDate, maxDate, minValue, maxValue) => {
  return [
    {
      x: [forecastDate, forecastDate],
      y: [minValue, maxValue],
      type: "line",
      mode: "lines",
      name: "Forecast",
      line: {
        color: colors[4],
        width: 1.5,
        dash: "dash",
      },
      showlegend: false,
    },
    {
      x: [maxDate, maxDate],
      y: [minValue, maxValue],
      type: "line",
      mode: "lines",
      name: "Forecast",
      line: {
        color: colors[4],
        width: 1.5,
        dash: "dash",
      },
      showlegend: false,
    },
    {
      x: [forecastDate, maxDate],
      y: [maxValue, maxValue],
      type: "line",
      mode: "lines",
      name: "Forecast",
      line: {
        color: colors[4],
        width: 3,
        dash: "dash",
      },
      showlegend: false,
    },
    {
      x: [forecastDate, maxDate],
      y: [minValue, minValue],
      type: "line",
      mode: "lines",
      name: "Forecast",
      line: {
        color: colors[4],
        width: 3,
        dash: "dash",
      },
      showlegend: false,
    },
    {
      x: [forecastDate],
      y: [maxValue * 0.98],
      mode: "lines+text",
      text: [" <b>Forecast</b>"],
      textposition: "bottom right",
      type: "scatter",
      showlegend: false,
    },
  ];
};

export const observed = (timeSeries, forecastDate) =>
  timeSeries.filter((d) => d.time <= forecastDate);

export const predicted = (timeSeries, forecastDate) =>
  timeSeries.filter((d) => d.time >= forecastDate);

export const plotProps = (title, yaxis = undefined, mobile) => ({
  config: { displaylogo: false, responsive: false, displayModeBar: !mobile },
  layout: {
    autosize: true,
    margin: {
      l: mobile ? 20 : 40,
      t: mobile ? 20 : 40,
      b: mobile ? 10 : 40,
      r: mobile ? 10 : 40,
    },
    font: {
      family: "Arial",
      size: mobile ? 6 : 12,
    },
    title,
    yaxis: {
      title: yaxis,
      showgrid: true,
    },
    xaxis: {
      showgrid: true,
    },
    legend: {
      traceorder: "normal",
    },
    showlegend: !mobile,
  },
  useResizeHandler: true,
  style: { width: "100%", height: mobile ? 100 : 250 },
});

export const plotPropsCategory = (title, mobile) => ({
  config: { displaylogo: false, responsive: false, displayModeBar: false },
  layout: {
    autosize: true,
    margin: {
      l: mobile ? 20 : 40,
      t: mobile ? 20 : 40,
      b: mobile ? 10 : 40,
      r: mobile ? 10 : 40,
    },
    font: {
      family: "Arial",
      size: mobile ? 6 : 12,
    },
    title,
    yaxis: {
      showgrid: false,
      showticklabels: false,
    },
    xaxis: {
      showgrid: false,
    },
    legend: {
      traceorder: "normal",
    },
    showlegend: !mobile,
  },
  useResizeHandler: true,
  style: { width: "100%", height: mobile ? 100 : 250 },
});

export const plotProps2d = (title, mobile) => ({
  config: { displaylogo: false, responsive: true, displayModeBar: false },
  layout: {
    autosize: true,
    margin: {
      l: mobile ? 20 : 60,
      t: mobile ? 20 : 40,
      b: mobile ? 10 : 40,
      r: mobile ? 20 : 60,
    },
    font: {
      family: "Arial",
      size: mobile ? 6 : 12,
    },
    title,
    yaxis: {
      showgrid: true,
      hoverformat: ".3f",
      showticklabels: false,
    },
    xaxis: {
      showgrid: true,
      hoverformat: ".3f",
      showticklabels: false,
    },
    legend: {
      traceorder: "normal",
    },
  },
  useResizeHandler: true,
  style: { width: mobile ? "25vw" : "28vw", height: "25vw" },
});

export const plotPropsSurface = (title, mobile) => ({
  config: {
    displaylogo: false,
    responsive: true,
    displayModeBar: !mobile,
    modeBarButtonsToRemove: [
      "resetCameraDefault3d",
      "resetCameraLastSave3d",
      "zoom3d",
      "pan3d",
      "orbitRotation",
      "toImage",
    ],
  },
  layout: {
    autosize: true,
    margin: {
      l: mobile ? 1 : 60,
      t: mobile ? 1 : 40,
      b: mobile ? 1 : 40,
      r: mobile ? 1 : 60,
    },
    font: {
      family: "Arial",
      size: mobile ? 6 : 12,
    },
    title,
    scene: {
      camera: {
        eye: { x: 1.25, y: -1.25, z: 1.25 },
      },
      xaxis: {
        showticklabels: false,
        title: "",
      },
      yaxis: {
        showticklabels: false,
        title: "",
      },
      zaxis: {
        title: "",
      },
    },
    legend: {
      traceorder: "normal",
    },
  },
  useResizeHandler: true,
  style: { width: mobile ? "25vw" : "28vw", height: "25vw" },
});

export const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
export const toInches = (mm) => mm / 25.4;
export const toMm = (inches) => inches * 25.4;
export const toMph = (ms) => ms * 2.23694;
