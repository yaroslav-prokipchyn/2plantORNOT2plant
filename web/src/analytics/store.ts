import { configureStore, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { createLogger } from "redux-logger";

export const formSlice = createSlice({
  name: "form",
  initialState: {
    units: localStorage.getItem('unitSystem') ?? "imperial",
    beginDate: null,
    endDate: dayjs().add(10, "days").format("YYYY-MM-DD"),
  },
  reducers: {
    setUnits: (state, action) => {
      state.units = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
  },
});

export const vizSlice = createSlice({
  name: "viz",
  initialState: {
    fieldLevelMoisture: null,
    precipitation: null,
    plantingWindow: null,
    riskMaps: null,
    saturationRisk: null,
    sufficiencyRisk: null,
    seedZoneMoisture: null,
    waterAvailable: null,
  },
  reducers: {
    setFieldLevelMoisture: (state, action) => {
      state.fieldLevelMoisture = action.payload;
    },
    setPrecipitation: (state, action) => {
      state.precipitation = action.payload;
    },
    setPlantingWindow: (state, action) => {
      state.plantingWindow = action.payload;
    },
    setSaturationRisk: (state, action) => {
      state.saturationRisk = action.payload;
    },
    setRiskMaps: (state, action) => {
      state.riskMaps = action.payload;
    },
    setSufficiencyRisk: (state, action) => {
      state.sufficiencyRisk = action.payload;
    },
    setSeedZoneMoisture: (state, action) => {
      state.seedZoneMoisture = action.payload;
    },
    setWaterAvailable: (state, action) => {
      state.waterAvailable = action.payload;
    },
  },
});

export default configureStore({
  reducer: {
    form: formSlice.reducer,
    viz: vizSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return getDefaultMiddleware().concat(createLogger() as any);
    }
    return getDefaultMiddleware();
  },
});
