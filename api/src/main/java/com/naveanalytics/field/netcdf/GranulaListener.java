package com.naveanalytics.field.netcdf;

import com.naveanalytics.field.FieldRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;



@Service
@AllArgsConstructor
public class GranulaListener {

    ReadNetCdf readNetCdf;
    FieldRepository fieldRepository;

    public void loadGranuleFile(String bucket, String key) {
        var fieldProperties = readNetCdf.readSingleGranuleFile(bucket, key);
        var granuleProperties = readNetCdf.resolveFieldOrganizationAndFileType(bucket, key, fieldProperties);
        var field = fieldRepository.findById(granuleProperties.fieldGuid()).orElseThrow(() -> new IllegalStateException("Grranule file import failed " + key + ". Field " + granuleProperties.fieldGuid() + " does not exist in the system"));
        field.getGranule().put(granuleProperties.fileType(), fieldProperties);
        fieldRepository.save(field);
    }

}
