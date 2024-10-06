package com.naveanalytics.organization;

import com.naveanalytics.field.AllowedFieldCategory;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Data
@Builder
@Jacksonized
public final class OrganizationRequest {
    private String name;
    private String address;
    private String phone;
    private String firstName;
    private String lastName;
    private String email;
    @Builder.Default
    private List<AllowedFieldCategory> categories = List.of();
}
