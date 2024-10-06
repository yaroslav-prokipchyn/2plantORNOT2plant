import { vizSlice } from "./store";
import { config } from "../config/config";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const a = vizSlice.actions;

async function dataFetch(route, group, fieldId, token) {
  return axios(
    `${config.VISUALIZATION_API_URL}/v1/${route}/${group}/${fieldId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }
  ).then(({ data }) => data);
}

export const vizThunk = (group, fieldId) => async (dispatch) => {
  dispatch(a.setPrecipitation(""));
  dispatch(a.setPlantingWindow(""));
  dispatch(a.setRiskMaps(""));
  dispatch(a.setSaturationRisk(""));
  dispatch(a.setSufficiencyRisk(""));
  dispatch(a.setSeedZoneMoisture(""));
  dispatch(a.setWaterAvailable(""));
  dispatch(a.setFieldLevelMoisture(""));


  const token =  (await fetchAuthSession()).tokens?.accessToken.toString();
  async function fetchDataAndDispatch(dataType, actionCreator) {
    try {
      const data = await dataFetch(dataType, group, fieldId, token);
      dispatch(actionCreator(data));
    } catch {
      dispatch(actionCreator(null));
    }
  }

  await fetchDataAndDispatch("precipitation", a.setPrecipitation);
  await fetchDataAndDispatch("planting-window", a.setPlantingWindow);
  await fetchDataAndDispatch("risk-maps", a.setRiskMaps);
  await fetchDataAndDispatch("saturation-risk", a.setSaturationRisk);
  await fetchDataAndDispatch("sufficiency-risk", a.setSufficiencyRisk);
  await fetchDataAndDispatch("seed-zone-moisture", a.setSeedZoneMoisture);
  await fetchDataAndDispatch("water-available", a.setWaterAvailable);
  await fetchDataAndDispatch("field-level-moisture", a.setFieldLevelMoisture);

};
