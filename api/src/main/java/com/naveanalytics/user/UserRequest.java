package com.naveanalytics.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

import java.util.List;
import java.util.UUID;

@Builder
@Jacksonized
@Value
public class UserRequest {
    @NotNull
    @With
    String firstName;
    @NotNull
    @With
    String lastName;
    @NotNull
    @With
    String email;
    @NotNull
    @NotEmpty
    @With
    List<User.Role> roles;
    @With
    UUID organizationId;

    @JsonIgnore
    public boolean isAdmin() {
        return roles.contains(User.Role.admin);
    }

    @JsonIgnore
    public boolean isAgronomist() {
        return roles.contains(User.Role.agronomist);
    }

    @JsonIgnore
    public boolean isSuperAdmin() {
        return roles.contains(User.Role.super_admin);
    }
}
