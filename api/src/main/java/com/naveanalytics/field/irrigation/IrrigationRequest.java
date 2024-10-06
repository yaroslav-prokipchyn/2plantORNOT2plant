package com.naveanalytics.field.irrigation;

import lombok.Value;

import java.time.LocalDate;
import java.util.UUID;

@Value
public class IrrigationRequest {
    UUID fieldId;
    LocalDate date;
    Double value;
}
