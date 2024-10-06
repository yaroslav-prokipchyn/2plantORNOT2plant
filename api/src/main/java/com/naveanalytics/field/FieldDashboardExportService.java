package com.naveanalytics.field;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naveanalytics.Convertor;
import com.naveanalytics.organization.OrganizationService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class FieldDashboardExportService {

    private FieldService fieldService;
    private OrganizationService organizationService;


    @SneakyThrows
    public String exportFieldsToJson(List<UUID> orgIds) {
        var fields = fieldService.getFieldsForExportByOrgIds(orgIds).stream()
                .filter(field -> field.organization.isLocked())
                .toList();

        return new ObjectMapper().writeValueAsString(
                fields.stream().map(field ->
                        Map.of(
                                "fieldUUID", field.getId().toString(),
                                "organizationUUID", field.getOrganization().getId().toString(),
                                "organizationName", field.getOrganization().getName(),
                                "agronomist", field.getAgronomist() != null ? field.getAgronomist().getFirstName() + " " + field.getAgronomist().getLastName() : "",
                                "plantedAt", field.getPlantedAt() != null ? field.getPlantedAt().toString() : "",
                                "name", field.getName(),
                                "crop", field.getCrop() != null ? field.getCrop().getName() : "",
                                "area", field.getArea().stream().map(point -> List.of(point.getLat(), point.getLng())).toList(),
                                "categories", field.getCategories().toString()
                        )
                ).toList());
    }

    public String prepareFieldValueForExportToCsv(Optional<String> fieldValue, String unit, String system) {
        return fieldValue
                .map(value -> {
                    boolean displayUnitsAreInch = "imperial".equalsIgnoreCase(system) && unit.equalsIgnoreCase("mm");

                    var val = displayUnitsAreInch
                            ? Convertor.convert(Double.parseDouble(value), "mm", "in")
                            : Double.parseDouble(value);

                    return String.valueOf(
                            BigDecimal.valueOf(val).setScale(displayUnitsAreInch ? 2 : 0, RoundingMode.HALF_UP)
                    );
                }).orElse("");
    }

}
