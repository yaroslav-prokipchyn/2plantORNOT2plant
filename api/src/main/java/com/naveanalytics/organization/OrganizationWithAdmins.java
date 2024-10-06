package com.naveanalytics.organization;

import com.naveanalytics.field.AllowedFieldCategory;
import com.naveanalytics.user.User;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record OrganizationWithAdmins(
        UUID id,
        String name,
        String address,
        String phone,
        List<User> admins,
        boolean locked,
        LocalDate lockedAt,
        String clientId,
        List<AllowedFieldCategory> categories
) {}
