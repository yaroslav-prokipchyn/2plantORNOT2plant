package com.naveanalytics.field;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AllowedFieldCategory {
    String name;
    String key;
    List<String> allowedOptions;

    @Override
    public String toString() {
        return '{' + "name=" + name + ", key=" + key + ", allowedOptions=" + allowedOptions + '}';
    }
}
