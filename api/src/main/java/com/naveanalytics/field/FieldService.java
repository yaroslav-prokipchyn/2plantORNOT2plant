package com.naveanalytics.field;

import com.naveanalytics.crop.CropRepository;
import com.naveanalytics.field.irrigation.Irrigation;
import com.naveanalytics.field.irrigation.IrrigationRepository;
import com.naveanalytics.organization.OrganizationRepository;
import com.naveanalytics.organization.OrganizationService;
import com.naveanalytics.user.User;
import com.naveanalytics.user.UserRepository;
import com.naveanalytics.user.UserService;
import com.naveanalytics.user.auth.AuthenticationProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FieldService {

    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationService organizationService;
    private final AuthenticationProvider authenticationProvider;
    private final UserService userService;
    private final IrrigationRepository irrigationRepository;
    private final FieldValidatorService fieldValidatorService;

    /**
     * Note: This method does not have security scope restrictions!
     *
     * @param fieldIds list of field ids to get irrigation for each field
     * @return most recent irrigation for each field in the list
     */
    //todo move this to irrigation service
    Map<UUID, Long> getLastIrrigationForFields(List<UUID> fieldIds) {
        var today = LocalDate.now();
        return irrigationRepository.findMostRecentIrrigationForFields(fieldIds).stream()
                .collect(Collectors.toMap(Irrigation::getFieldId, irrigation -> ChronoUnit.DAYS.between(irrigation.getDate(), today)));
    }

    private List<FieldWithIrrigation> addLastIrrigationData(List<Field> fields) {
        var lastIrrigationForFields = getLastIrrigationForFields(fields.stream().map(Field::getId).toList());
        return fields.stream()
                .map(field -> new FieldWithIrrigation(field, lastIrrigationForFields.getOrDefault(field.getId(), null)))
                .toList();
    }

    private FieldWithIrrigation addLastIrrigationData(Field field) {
        var lastIrrigationForFields = getLastIrrigationForFields(List.of(field.id));
        return new FieldWithIrrigation(field, lastIrrigationForFields.getOrDefault(field.getId(), 0L));
    }

    public List<FieldWithIrrigation> getFieldsWithIrrigationData(Optional<String> name) {
        return addLastIrrigationData(getFields(name));
    }

    public List<Field> getFields(Optional<String> name) {
        var user = authenticationProvider.getCurrentUser();
        return fieldRepository.findByAgronomistIdAndNameStartingWithIgnoreCase(
                authenticationProvider.isAgronomist() ? user.getId() : null,
                name.orElse(null),
                authenticationProvider.isAdmin() ? user.getOrganizationId() : null, null, null);
    }

    public List<FieldWithIrrigation> getFieldsByCategoryWithIrrigationData(AllowedFieldCategory allowedFieldCategory) {
        return addLastIrrigationData(getFieldsByCategory(allowedFieldCategory));
    }

    public List<Field> getFieldsByCategory(AllowedFieldCategory allowedFieldCategory) {
        var fields = getFields(Optional.empty());
        return fields.stream()
                .filter(field -> field.getCategories().stream()
                        .anyMatch(category -> category.getName().equals(allowedFieldCategory.getName())
                                              && category.getAllowedOptions().stream()
                                                      .anyMatch(option -> allowedFieldCategory.getAllowedOptions().contains(option))))
                .toList();
    }

    public List<FieldWithIrrigation> getFieldsByFilterWithIrrigationData(FieldsFilter fieldsFilter) {
        return addLastIrrigationData(getFieldsByFilter(fieldsFilter));
    }

    public List<Field> getFieldsByFilter(FieldsFilter fieldsFilter) {
        var user = authenticationProvider.getCurrentUser();

        var fields = fieldRepository.findByAgronomistIdAndNameStartingWithIgnoreCase(
                authenticationProvider.isAgronomist() ? user.getId() : null,
                null,
                authenticationProvider.isAdmin() ? user.getOrganizationId() : null,
                fieldsFilter.getField(),
                fieldsFilter.getCrop());

        return fields.stream().filter(f -> (fieldsFilter.getCurrentRiskOfBoggingRisk() == null || Objects.equals(f.getCurrentRiskOfBoggingRisk(), fieldsFilter.getCurrentRiskOfBoggingRisk()))
                                           && (fieldsFilter.getForecastRiskOfBoggingRisk() == null || Objects.equals(f.getForecastRiskOfBoggingRisk(), fieldsFilter.getForecastRiskOfBoggingRisk()))
                                           && (fieldsFilter.getCurrentSoilWaterContentRisk() == null || Objects.equals(f.getCurrentSoilWaterContentRisk(), fieldsFilter.getCurrentSoilWaterContentRisk()))
                                           && (fieldsFilter.getForecastSoilWaterContentRisk() == null || Objects.equals(f.getForecastSoilWaterContentRisk(), fieldsFilter.getForecastSoilWaterContentRisk()))
                                           && (fieldsFilter.getCurrentRiskOfWaterShortageRisk() == null || Objects.equals(f.getCurrentRiskOfWaterShortageRisk(), fieldsFilter.getCurrentRiskOfWaterShortageRisk()))
                                           && (fieldsFilter.getForecastRiskOfWaterShortageRisk() == null || Objects.equals(f.getForecastRiskOfWaterShortageRisk(), fieldsFilter.getForecastRiskOfWaterShortageRisk()))
                                           && (fieldsFilter.getExpectedRainRisk() == null || Objects.equals(f.getExpectedRainRisk(), fieldsFilter.getExpectedRainRisk()))).toList();

    }

    public List<Field> getFieldsForExport(List<UUID> ids) {
        if (ids.isEmpty()) {
            return getFields(Optional.empty());
        }
        return getFields(Optional.empty()).stream()
                .filter(field -> ids.contains(field.getId()))
                .toList();
    }

    public List<Field> getFieldsForExportByOrgIds(List<UUID> orgIds) {
        if (orgIds.isEmpty()) {
            return getFields(Optional.empty());
        }
        return getFields(Optional.empty()).stream()
                .filter(field -> orgIds.contains(field.organization.getId()))
                .toList();
    }

    public FieldWithIrrigation getFieldWithIrrigationData(UUID id) {
        return addLastIrrigationData(getField(id));
    }

    public Field getField(UUID id) {
        var user = authenticationProvider.getCurrentUser();
        var field = fieldRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Field not found"));
        if (authenticationProvider.isSuperAdmin()) {
            return field;
        }
        if (authenticationProvider.isAdmin() && Objects.equals(field.getOrganization().getId(), user.getOrganizationId())) {
            return field;
        }
        if (authenticationProvider.isAgronomist() && Objects.equals(field.getAgronomist().getId(), user.getId())) {
            return field;
        }
        throw new SecurityException("User does not have permission to view field" + id);
    }


    public FieldWithIrrigation updateFieldWithIrrigation(UUID fieldId, FieldRequest fieldRequest) {
        return addLastIrrigationData(updateField(fieldId, fieldRequest));
    }

    public Field updateField(UUID id, FieldRequest fieldRequest) {
        var currentUser = authenticationProvider.getCurrentUser();
        var field = fieldRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Field not found"));
        if (organizationService.getOrganization(currentUser.getOrganizationId()).locked()
            && (!Objects.equals(field.area, fieldRequest.area)
                || !Objects.equals(field.crop.getId(), fieldRequest.cropId)
                || !Objects.equals(field.plantedAt, fieldRequest.plantedAt))) {
            throw new SecurityException("Organization is locked. planting data, crop and area cannot be changed");
        }
        if (authenticationProvider.isSuperAdmin()) {
            return fieldRepository.save(updateField(field, fieldRequest));
        }
        if (authenticationProvider.isAdmin()
            && currentUser.getOrganizationId().equals(field.getOrganization().getId())
            && currentUser.getOrganizationId().equals(userService.getUser(fieldRequest.agronomistId).getOrganizationId())
        ) {
            return fieldRepository.save(updateField(field, fieldRequest));
        }
        throw new SecurityException("User does not have permission to update field");
    }

    public FieldWithIrrigation createFieldWithIrrigation(FieldRequest fieldRequest) {
        return addLastIrrigationData(createField(fieldRequest));
    }

    public Field createField(FieldRequest fieldRequest) {
        var user = authenticationProvider.getCurrentUser();
        var agronomistOrganizationId = userService.getUser(fieldRequest.agronomistId).getOrganizationId();
        if (!authenticationProvider.isSuperAdmin() && organizationService.getOrganization(user.getOrganizationId()).locked()) {
            throw new SecurityException("Organization is locked. Cannot create field");
        }
        if (authenticationProvider.isSuperAdmin()) {
            return fieldRepository.save(updateField(new Field(), fieldRequest));
        }
        if (authenticationProvider.isAdmin() && user.getOrganizationId().equals(agronomistOrganizationId)) {
            return fieldRepository.save(updateField(new Field(), fieldRequest));
        }
        throw new SecurityException("Agronomist must belong to the same organization as the current user and the current user must be an admin");
    }

    private Field updateField(Field field, FieldRequest fieldRequest) {

        var agronomistOrganizationId = userService.getUser(fieldRequest.agronomistId).getOrganizationId();
        var organizationCategories = organizationRepository.findById(agronomistOrganizationId)
                .orElseThrow(() -> new IllegalArgumentException("Organization with ID " + agronomistOrganizationId + " not found"))
                .getCategories();

        if (!fieldValidatorService.isFieldCategoriesAreSubsetOfOrganizationCategories(fieldRequest.categories, organizationCategories)) {
            throw new IllegalArgumentException(
                    "Field " + fieldRequest.name + " with categories " + fieldRequest.categories
                    + " must be a subset of organization categories " + organizationCategories
            );
        }

        field.setName(fieldRequest.name);
        field.setArea(fieldRequest.area);
        field.setCrop(cropRepository.findById(fieldRequest.cropId).orElseThrow(() -> new IllegalArgumentException("Crop not found")));
        field.setPlantedAt(fieldRequest.plantedAt);
        var agronomist = userRepository.findById(fieldRequest.agronomistId).orElseThrow(() -> new IllegalArgumentException("Agronomist not found"));
        field.setAgronomist(agronomist);
        field.setOrganization(organizationRepository.findById(agronomist.getOrganizationId()).orElseThrow(() -> new IllegalArgumentException("Organization not found")));
        field.setCategories(fieldRequest.categories);

        return field;
    }

    @Transactional
    public void deleteField(UUID id) {
        var organization = this.getField(id).getOrganization();
        if (organization.isLocked()) {
            throw new SecurityException("Field in locked organization cannot be deleted");
        }
        var currentUser = authenticationProvider.getCurrentUser();
        if (!authenticationProvider.isSuperAdmin() && !(authenticationProvider.isAdmin() && currentUser.getOrganizationId().equals(organization.getId()))) {
            throw new SecurityException("User does not have permission to delete field");
        }

        irrigationRepository.deleteByFieldId(id);
        fieldRepository.deleteById(id);
    }

    public List<Field> getByAgronomistId(User user) {
        if (authenticationProvider.isSuperAdmin()
            || (authenticationProvider.isAdmin() && user.getOrganizationId().equals(authenticationProvider.getCurrentUser().getOrganizationId()))
            || (user.getId().equals(authenticationProvider.getCurrentUser().getId()))) {
            return fieldRepository.findByAgronomistId(user.getId());
        } else {
            throw new SecurityException("User does not have permission to view fields");
        }
    }

    /**
     * Warning this method does not have security scope restrictions!
     *
     * @param user  user to assign field to
     * @param field field to assign to user
     */
    public void reassignField(User user, Field field) {
        field.setAgronomist(user);
        fieldRepository.save(field);
    }
}
