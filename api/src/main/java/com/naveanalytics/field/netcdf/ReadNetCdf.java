package com.naveanalytics.field.netcdf;

import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import ucar.nc2.Attribute;
import ucar.nc2.NetcdfFile;
import ucar.nc2.NetcdfFiles;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.util.stream.Collectors.toMap;

@Service
@AllArgsConstructor
@Log4j2
public class ReadNetCdf {

    private FileSystemUtil fileSystemUtil;


    public Map<String, Map<String, String>> readGranuleProperties(String bucket, String folderKey) {
        List<String> files = fileSystemUtil.listObjects(bucket, folderKey);
        return files.stream().collect(HashMap::new,
                (map, file) -> {
                    var globalAttributes = readSingleGranuleFile(bucket, file);
                    var granuleProperties = resolveFieldOrganizationAndFileType(bucket, file, globalAttributes);
                    map.put(granuleProperties.fileType, globalAttributes);
                },
                HashMap::putAll
        );
    }

    @SneakyThrows
    public Map<String, String> readSingleGranuleFile(String bucket, String folderKey) {
        var startTimer = System.currentTimeMillis();
        try (NetcdfFile netcdfFile = NetcdfFiles.open("cdms3:" + bucket + "?" + folderKey)) {
            log.debug("Open file: " + folderKey + " in " + (System.currentTimeMillis() - startTimer) + "ms");
            return netcdfFile.getGlobalAttributes().stream().collect(
                    toMap(Attribute::getFullName, attribute -> attribute.getValue(0).toString()));
        }
    }

    public GranuleProperties resolveFieldOrganizationAndFileType(String bucket, String key, Map<String, String> fieldProperties) {
        Pattern pattern = Pattern.compile("^(.{10})/(.{36})/(FBTM|FTOP|FW1D|SGR250)_.*?(HR|WR)?(es)?.nc$");
        Matcher granuleTypeMatcher = pattern.matcher(key);

        String date;
        String fieldUUID;
        String granuleType;
        String resolution;

        if (granuleTypeMatcher.find()) {
            date = granuleTypeMatcher.group(1);
            fieldUUID = granuleTypeMatcher.group(2);
            granuleType = granuleTypeMatcher.group(3);
            resolution = granuleTypeMatcher.group(4) == null ? "" : granuleTypeMatcher.group(4);
        } else {
            throw new RuntimeException("Can not parse granule file name: " + bucket + "/" + key);
        }
        return new GranuleProperties(date, UUID.fromString(bucket), UUID.fromString(fieldUUID), granuleType + resolution);
    }

    public String getFieldIdFromGranulePath(String bucketName, String folderKey) {
        return folderKey.split("/")[1];
    }

    public record GranuleProperties(String date, UUID organizationGuid, UUID fieldGuid, String fileType) {
    }

}
