package com.naveanalytics;

public interface Convertor {

    static double convert(double value, String sourceUnit, String destinationUnit) {
        if (sourceUnit.equals("mm") && destinationUnit.equals("in")) {
            return value * 0.0393701;
        } else {
            throw new IllegalArgumentException("Conversion from " + sourceUnit + " to " + destinationUnit + " is not supported");
        }
    }
    
}
