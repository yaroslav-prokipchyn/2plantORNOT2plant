package com.naveanalytics.field.irrigation.export;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naveanalytics.field.irrigation.IrrigationRepository;
import com.naveanalytics.field.irrigation.IrrigationService;
import com.naveanalytics.user.auth.AuthenticationProvider;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class IrrigationJsonExportService {

    private IrrigationService irrigationService;
    private AuthenticationProvider authenticationProvider;
    private IrrigationRepository irrigationRepository;

    @SneakyThrows
    public String exportIrrigationDataToJson(List<UUID> orgIds) {
        List<IrrigationWithOrgId> irrigationList = findIrrigationForFieldsOfOrganizationInAndLocked(orgIds);
        var irrigationGroupedByField = irrigationList.stream()
                .collect(Collectors.groupingBy(IrrigationWithOrgId::getFieldId))
                .entrySet().stream()
                .map(e ->
                        Map.of(
                                "fieldUUID", e.getKey(),
                                "organizationUUID", e.getValue().getFirst().getOrganizationId(),
                                "irrigationData", e.getValue().stream()
                                        .filter(irrigation -> irrigation.getValue() != null && irrigation.getDate() != null)
                                        .map(irrigation ->
                                                Map.of(
                                                        "date", irrigation.getDate().toString(),
                                                        "value", irrigation.getValue()
                                                )).toList(
                                        ))).toList();
        return new ObjectMapper().writeValueAsString(irrigationGroupedByField);
    }

    public List<IrrigationWithOrgId> findIrrigationForFieldsOfOrganizationInAndLocked(List<UUID> orgIds) {
        var currentUser = authenticationProvider.getCurrentUser();

        if (authenticationProvider.isSuperAdmin()) {
            var organisationsForQuery = orgIds.isEmpty() ? null : orgIds;
            return irrigationRepository.findIrrigationForFieldsOfOrganizationInAndLocked(organisationsForQuery);
        }
        if (authenticationProvider.isAdmin() && (orgIds == null || orgIds.isEmpty() || orgIds.equals(List.of(currentUser.getOrganizationId())))) {
            return irrigationRepository.findIrrigationForFieldsOfOrganizationInAndLocked(List.of(currentUser.getOrganizationId()));
        }
        throw new SecurityException("User does not have permission to view irrigation data for the specified organization");
    }

}
