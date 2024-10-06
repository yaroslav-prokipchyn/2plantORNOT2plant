package com.naveanalytics.field;

import com.naveanalytics.crop.Crop;
import com.naveanalytics.organization.Organization;
import com.naveanalytics.user.User;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Data
public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    String name;
    @Type(JsonType.class)
    @NotNull
    List<Point> area;

    @ManyToOne
    Crop crop;
    LocalDate plantedAt;

    @ManyToOne
    User agronomist;

    @NotNull
    @ManyToOne
    Organization organization;

    @Type(JsonType.class)
    Map<String, Map<String, String>> granule = new HashMap<>();

    @Type(JsonType.class)
    Map<String, Object> attributes = new HashMap<>();

    @NotNull
    @Type(JsonType.class)
    private List<AllowedFieldCategory> categories = List.of();

    @Transient
    public String getCurrentSoilWaterContent() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Curent_rzsm_mm");
    }

    @Transient
    public String getCurrentSoilWaterContentRisk() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Current_rzsm_risk_category");
    }

    @Transient
    public String getForecastSoilWaterContent() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Forecast_rzsm_mm");
    }

    @Transient
    public String getForecastSoilWaterContentRisk() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Forecast_rzsm_risk_category");
    }





    @Transient
    public String getCurrentRiskOfBogging() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Current_wexcess_risk_perc");
    }

    @Transient
    public String getCurrentRiskOfBoggingRisk() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Current_wexcess_risk_category");
    }

    @Transient
    public String getForecastRiskOfBogging() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Forecast_wexcess_risk_perc");
    }

    @Transient
    public String getForecastRiskOfBoggingRisk() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Forecast_wexcess_risk_category");
    }



    @Transient
    public String getCurrentRiskOfWaterShortage() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Current_wshort_risk_perc");
    }

    @Transient
    public String getCurrentRiskOfWaterShortageRisk() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Current_wshort_risk_category");
    }

    @Transient
    public String getForecastRiskOfWaterShortage() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Forecast_wshort_risk_perc");
    }

    @Transient
    public String getForecastRiskOfWaterShortageRisk() {
        return getGranuleParameterHandlingMissingValues("FBTMWR", "Forecast_wshort_risk_category");
    }

    @Transient
    public String getExpectedRain() {
        return getGranuleParameterHandlingMissingValues("FW1D", "Forecast_precip_mm_week");
    }

    @Transient
    public String getExpectedRainRisk() {
        return getGranuleParameterHandlingMissingValues("FW1D", "Forecast_precip_risk_category");
    }




    private String getGranuleParameterHandlingMissingValues(String granuleName, String parameterName) {
        return getGranule().get(granuleName) == null || getGranule().get(granuleName).get(parameterName) == null
                ? null
                : getGranule().get(granuleName).get(parameterName);
    }
}
