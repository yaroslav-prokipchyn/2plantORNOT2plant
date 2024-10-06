package com.naveanalytics.field.netcdf;

import java.util.List;

public interface FileSystemUtil {
    List<String> listObjects(String bucket, String key);

    List<String> listSubFolder(String bucket, String key);

    void createBucket(String id, String organizationName, String organizationId, String clientId);

    void deleteBucketAndRoleAndPolicy(String organizationName, String clientId, Boolean deleteBucket);
}
