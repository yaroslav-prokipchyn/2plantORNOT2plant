package com.naveanalytics.field.netcdf;

import com.naveanalytics.field.Field;
import com.naveanalytics.field.FieldRepository;
import com.naveanalytics.organization.Organization;
import com.naveanalytics.organization.OrganizationRepository;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
@Log4j2
public class GranuleImporter {

    private OrganizationRepository organisationRepository;
    private ReadNetCdf readNetCdf;
    private FileSystemUtil fileSystemUtil;
    private FieldRepository fieldRepository;

    public void importGranules() {
        organisationRepository.findAll().forEach(organisation -> {
            try {
                importOrganizationGranule(organisation);
            } catch (Exception e) {
                log.error("Error importing granule for organization: " + organisation.getId() + " " + e.getMessage());
            }
        });
    }

    private void importOrganizationGranule(Organization organisation) {
        var bucketName = organisation.getId().toString();
        var dateFolders = fileSystemUtil.listSubFolder(bucketName, "");
        LocalDate lastImportedFolder = organisation.getLastImportDate();
        log.info("Last imported folder for organization: " + organisation.getId() + " is " + lastImportedFolder.toString());

        var newGranules = dateFolders.stream()
                .filter(dateFolder -> LocalDate.parse(dateFolder).isAfter(lastImportedFolder))
                .sorted().toList();
        if (newGranules.isEmpty()) {
            log.info("No new granules to import for organization: " + organisation.getId());
            return;
        }
        log.info("New dates for organization: " + organisation.getId() + " is " + newGranules);
        String dateFolder = newGranules.getLast(); // importing only last date
        var fieldsGranules = fileSystemUtil.listSubFolder(bucketName, dateFolder + "/");
        log.info("Field to import " + fieldsGranules + " for organization: " + organisation.getId() + " on date " + dateFolder);
        fieldsGranules
                .forEach(fieldId -> {
                    try {
                        importGranule(bucketName, dateFolder + "/" + fieldId);
                    } catch (Exception e) {
                        log.error("Error importing granule for organization: " + organisation.getId() + " on date " + dateFolder + " for field: " + fieldId + " " + e.getMessage());
                    }
                });
        organisation.setLastImportDate(LocalDate.parse(dateFolder));
        organisationRepository.save(organisation);

        log.info("Imported granule for organization: " + organisation.getId() + " is " + dateFolder);
    }

    private void importGranule(String bucketName, String folderKey) {
        Map<String, Map<String, String>> granule = readNetCdf.readGranuleProperties(bucketName, folderKey);
        var fieldId = readNetCdf.getFieldIdFromGranulePath(bucketName, folderKey);
        Field field = fieldRepository.findById(UUID.fromString(fieldId)).orElseThrow(() -> new IllegalStateException("Granule file import failed s3://" + bucketName + "/" + folderKey + ". Field " + fieldId + " does not exist in the system"));
        field.setGranule(granule);
        fieldRepository.save(field);
    }
}
