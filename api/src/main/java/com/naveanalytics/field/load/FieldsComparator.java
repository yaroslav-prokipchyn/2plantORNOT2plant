package com.naveanalytics.field.load;

import com.naveanalytics.field.Field;

import java.util.function.Predicate;

public class FieldsComparator {

    public static Predicate<? super Field> sameCoordinates(FieldFromShapeFile importedField) {
        return field -> field.getArea().equals(importedField.getArea());
    }
}
