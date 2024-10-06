package com.naveanalytics.field.load;

import com.naveanalytics.crop.CropRepository;
import com.naveanalytics.field.Field;
import com.naveanalytics.field.FieldRepository;
import com.naveanalytics.field.FieldService;
import com.naveanalytics.organization.OrganizationRepository;
import com.naveanalytics.user.User;
import com.naveanalytics.user.UserService;
import com.naveanalytics.user.auth.AuthenticationProvider;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static com.naveanalytics.field.load.FieldsComparator.sameCoordinates;


@Service
@AllArgsConstructor
@Log4j2
public class ImportService {

    private final FieldService fieldService;
    private FieldsImportService fieldsImportService;
    private FieldRepository fieldRepository;
    private AuthenticationProvider authenticationProvider;
    private OrganizationRepository organizationRepository;
    private CropRepository cropRepository;
    private UserService userService;

    @SneakyThrows
    public List<Field> importFields(File file) {

        var fieldsAttributes = fieldsImportService.importFields(file);
        var user = authenticationProvider.getCurrentUser();
        var organization = organizationRepository.findById(user.getOrganizationId()).orElseThrow(() -> new IllegalArgumentException("Organization not found" + user.getOrganizationId()));
        if (!authenticationProvider.isAdmin()) {
            throw new SecurityException("Only admin users can import fields");
        }

        var organizationFields = fieldService.getFields(Optional.empty());

        var crops = cropRepository.findAll();
        var agronomistsAndAdmins = userService.getUsersByRole(User.Role.agronomist);
        agronomistsAndAdmins.addAll(userService.getUsersByRole(User.Role.admin));
        var uniqueUsers = agronomistsAndAdmins.stream().distinct().toList();


        var fieldToSave = fieldsAttributes.stream()
                .filter(importedField -> organizationFields.stream().noneMatch(sameCoordinates(importedField)))
                .map(importedField -> {
                    var field = new Field();
                    field.setName(getAttrString(importedField, "field_name"));

                    var cropAttr = getAttrString(importedField, "crop");
                    if (cropAttr != null) {
                        crops.stream().filter(c -> c.getId().equals(cropAttr.toLowerCase())).findFirst().ifPresentOrElse(
                                field::setCrop,
                                () -> log.warn("Crop not found: " + cropAttr)
                        );
                    }
                    var agronomistAttr = getAttrString(importedField, "agronomist");
                    if (agronomistAttr != null) {
                        var users = uniqueUsers.stream().filter(a -> (a.getFirstName() + " " + a.getLastName()).equalsIgnoreCase(agronomistAttr)).toList();
                        if (users.size() == 1) {
                            field.setAgronomist(users.get(0));
                        } else {
                            log.warn("Agronomist not found: " + agronomistAttr);
                        }
                    }
                    var plantingDateAttr = getAttrString(importedField, "pl_date");
                    try {
                        var parse = LocalDate.parse(plantingDateAttr);
                        field.setPlantedAt(parse);
                    } catch (Exception e) {
                        log.warn("Invalid planting date: " + plantingDateAttr);
                    }

                    field.setArea(importedField.getArea());
                    field.setAttributes(importedField.getAttributes());
                    field.setOrganization(organization);
                    return field;
                }).toList();
        return fieldRepository.saveAll(fieldToSave);
    }

    private static String getAttrString(FieldFromShapeFile importedField, String attr) {
        return importedField.getAttributes().get(attr) != null ? importedField.getAttributes().get(attr).toString() : null;
    }
}
