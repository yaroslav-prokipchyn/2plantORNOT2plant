package com.naveanalytics.field;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Getter
@Builder
@Jacksonized
@EqualsAndHashCode
public class FieldsFilter {
    private List<String> crop;
    private List<String> field;
    private String parameter;
    private String threshold;

    private String getThresholdOrNull(String expectedParameter) {
        if (expectedParameter.equalsIgnoreCase(parameter)) {
            return threshold;
        } else {
            return null;
        }
    }

    @JsonIgnore
    public String getCurrentRiskOfBoggingRisk() {
        return getThresholdOrNull("CurrentRiskOfBoggingRisk");
    }

    @JsonIgnore
    public String getForecastRiskOfBoggingRisk() {
        return getThresholdOrNull("ForecastRiskOfBoggingRisk");
    }

    @JsonIgnore
    public String getCurrentSoilWaterContentRisk() {
        return getThresholdOrNull("CurrentSoilWaterContentRisk");
    }

    @JsonIgnore
    public String getForecastSoilWaterContentRisk() {
        return getThresholdOrNull("ForecastSoilWaterContentRisk");
    }

    @JsonIgnore
    public String getCurrentRiskOfWaterShortageRisk() {
        return getThresholdOrNull("CurrentRiskOfWaterShortageRisk");
    }

    @JsonIgnore
    public String getForecastRiskOfWaterShortageRisk() {
        return getThresholdOrNull("ForecastRiskOfWaterShortageRisk");
    }

    @JsonIgnore
    public String getExpectedRainRisk() {
        return getThresholdOrNull("ExpectedRainRisk");
    }

}
