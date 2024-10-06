package com.naveanalytics.field;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Delegate;

@AllArgsConstructor
@Value
public class FieldWithIrrigation {

    @Delegate
    @JsonIgnore
    Field field;
    Long lastIrrigationDays;

}
