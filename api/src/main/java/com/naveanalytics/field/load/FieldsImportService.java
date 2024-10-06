package com.naveanalytics.field.load;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naveanalytics.field.Point;
import lombok.SneakyThrows;
import org.geotools.api.data.DataStoreFinder;
import org.geotools.api.feature.simple.SimpleFeature;
import org.geotools.api.feature.simple.SimpleFeatureType;
import org.geotools.api.feature.type.AttributeDescriptor;
import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FieldsImportService {
    @SneakyThrows
    public List<FieldFromShapeFile> importFields(File file) {
        var dataStore = DataStoreFinder.getDataStore(Map.of("url", file.toURI().toURL()));
        var typeName = dataStore.getTypeNames()[0];
        var source = dataStore.getFeatureSource(typeName);
        var collection = source.getFeatures();

        var features = collection.features();
        var files = new ArrayList<FieldFromShapeFile>();

        while (features.hasNext()) {
            SimpleFeature feature = features.next();
            Geometry geometry = (Geometry) feature.getDefaultGeometry();

            FieldFromShapeFile.FieldFromShapeFileBuilder fieldBuilder = FieldFromShapeFile.builder();
            fieldBuilder.area(
                    Arrays.stream(geometry.getCoordinates())
                            .map(coordinate -> new Point(coordinate.y, coordinate.x)).toList());

            fieldBuilder.attributes(getAttributeMap(feature));
            files.add(fieldBuilder.build());
        }

        features.close();
        dataStore.dispose();

        return files;
    }

    public static Map<String, Object> getAttributeMap(SimpleFeature feature) {
        Map<String, Object> attributeMap = new HashMap<>();
        SimpleFeatureType featureType = feature.getFeatureType();

        for (AttributeDescriptor descriptor : featureType.getAttributeDescriptors()) {
            String attributeName = descriptor.getLocalName();
            Object attributeValue = feature.getAttribute(attributeName);

            if (isSerializable(attributeValue)) {
                attributeMap.put(attributeName, attributeValue);
            } else {
                attributeMap.put(attributeName, attributeValue == null ? null : attributeValue.toString());
            }
        }
        return attributeMap;
    }

    private static boolean isSerializable(Object value) {
        try {
            new ObjectMapper().writeValueAsString(value);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
