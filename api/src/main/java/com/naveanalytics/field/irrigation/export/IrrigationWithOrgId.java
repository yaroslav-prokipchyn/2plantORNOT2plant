package com.naveanalytics.field.irrigation.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class IrrigationWithOrgId {
    UUID fieldId;
    Integer irrigationId;
    UUID organizationId;
    LocalDate date;
    Double value;
}
