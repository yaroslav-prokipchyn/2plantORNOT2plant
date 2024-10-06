import { useEffect, useState } from "react";
import { Button, Col, Flex, Result, Row, Spin, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

import fieldsAPI from "../api/fieldsAPI.ts";
import { EndDateDatePicker } from "./EndDateDatePicker.jsx";
import { Loading } from "./loading.jsx";
import { onPdf } from "./pdf";
import * as viz from "../viz2";
import { vizThunk } from "./viz.jsx";
import "./analytics.css";

function withLoader(VizComponent, data) {
  let element = null;
  if (data === "") {
    element = (
      <Row justify="center">
        <Spin />
      </Row>
    );
  } else if (data === null) {
    element = (
      <Row justify="center">
        <Result status="warning" subTitle={t("Data not found")} />
      </Row>
    );
  } else if (data) {
    element = (
      <div key={VizComponent.className}>
        <VizComponent data={data} />
        <br />
      </div>
    );
  }
  return (
    <Row
      style={{
        padding: 10,
        margin: 10,
        border: "1px solid #f0f0f0",
      }}
    >
      <Col xs={22} offset={1}>
        {element}
      </Col>
    </Row>
  );
}

function Analytics() {
  const { t } = useTranslation()
  const vizData = useSelector((state) => state.viz);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [field, setField] = useState(null);
  const [activeTab, setActiveTab] = useState("planting-conditions");
  const { id: fieldId, orgId } = useParams();
  const mobile = useMediaQuery("only screen and (max-width : 925px)");

  useEffect(() => {
    if (fieldId && orgId) {
      // TODO remove this conditional once we have a way to get field data from a real field
      if (process.env.NODE_ENV !== "development") {
        fieldsAPI.getById(fieldId).then(setField);
      } else {
        setField({ name: `Field Name` });
      }
      dispatch(vizThunk(orgId, fieldId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId]);

  const empties = Object.values(vizData).filter((value) => !value).length;
  const analyticsHeader = () => {
    if (mobile) {
      return (
        <Row justify="center" style={{ marginTop: 60 }} gutter={2}>
          <Col xs={12}>
            <h3>{field?.name}</h3>
          </Col>
          <Col xs={12}>
            <Button onClick={() => navigate(-1)} style={{ width: "100%" }}>
              Exit
            </Button>
          </Col>
          <Col xs={12}/>
          <Col xs={12}>
            <EndDateDatePicker style={{ width: "100%" }} />
          </Col>
        </Row>
      );
    }

    return (
      <Flex className={"action-bar"} justify={"space-between"} align={"center"}>
        <h3>{field?.name}</h3>
        <Flex
          className={"configs"}
          gap={"4px"}
          justify={"right"}
          align={"center"}
        >
          <EndDateDatePicker style={{ width: '180px' }} />
          <Button
            onClick={async () => {
              setIsExporting(true);
              const tabs = [
                "planting-conditions",
                "soil-moisture-content",
              ];
              for (const tab of tabs) {
                setActiveTab(tab);
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
              onPdf(()=>setIsExporting(false));
            }}
            disabled={empties > 0}
            loading={isExporting}
          >
            PDF
          </Button>
          <Button onClick={() => navigate(-1)}>Exit</Button>
        </Flex>
      </Flex>
    );
  };

  const analyticsStyle = mobile
    ? { padding: "0 10px 0 10px", marginTop: 70 }
    : { padding: "16px 24px 0 24px" };

  return (
    <div>
      <div style={analyticsStyle}>
        {analyticsHeader()}
        <Tabs
          style={{ width: "96vw", marginTop: 10 }}
          renderTabBar={(props, TabNavList) => (
            <TabNavList {...props} mobile={false} />
          )}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={[
              {
                  key: "planting-conditions",
                  label: "Planting Conditions",
                  children: (
                      <>
                          {withLoader(viz.PrecipitationBar, vizData.precipitation)}
                          {withLoader(
                              viz.PlantingWindowCategory,
                              vizData.plantingWindow
                          )}
                          {withLoader(viz.RiskMaps, vizData.riskMaps)}
                          {withLoader(
                              viz.SaturationRiskTimeSeries,
                              vizData.saturationRisk
                          )}
                          {withLoader(
                              viz.SufficiencyRiskTimeSeries,
                              vizData.sufficiencyRisk
                          )}
                      </>
                  ),
              },
              {
                  key: "soil-moisture-content",
                  label: "Soil Moisture Content",
                  children: (
                      <>
                          {withLoader(viz.PrecipitationBar, vizData.precipitation)}
                          {withLoader(
                              viz.PlantingWindowCategory,
                              vizData.plantingWindow
                          )}
                          {withLoader(
                              viz.SeedZoneMoistureRanges,
                              vizData.seedZoneMoisture
                          )}
                          {withLoader(
                              viz.WaterAvailableSurface,
                              vizData.waterAvailable
                          )}
                          {withLoader(
                              viz.FieldLevelMoistureRanges,
                              vizData.fieldLevelMoisture
                          )}
                      </>
                  ),
              },
          ]}
        />
      </div>
      <Loading />
    </div>
  );
}

export default Analytics;
