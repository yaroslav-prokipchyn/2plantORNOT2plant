package com.naveanalytics.field.netcdf;

public class AWSTagsUtil {
    public static String convertToValidAWSTag(String input) {
        String sanitizedInput = input.trim().replaceAll("[^a-zA-Z0-9\\s_.:/=+\\-@]", "_");
        if (sanitizedInput.length() > 128) {
            sanitizedInput = sanitizedInput.substring(0, 128);
        }
        return sanitizedInput;
    }
}
