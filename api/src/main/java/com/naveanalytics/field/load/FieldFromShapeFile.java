package com.naveanalytics.field.load;

import com.naveanalytics.field.Point;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Data
@Builder
public class FieldFromShapeFile {
    private List<Point> area;
    private Map<String, Object> attributes;
}
