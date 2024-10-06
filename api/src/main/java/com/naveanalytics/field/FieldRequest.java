package com.naveanalytics.field;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@With
@Builder
@Jacksonized
public class FieldRequest {
    String name;
    @NotNull
    List<Point> area;
    @NotNull
    String cropId;
    LocalDate plantedAt;
    @NotNull
    int agronomistId;

    @Builder.Default
    List<AllowedFieldCategory> categories = List.of();
}
