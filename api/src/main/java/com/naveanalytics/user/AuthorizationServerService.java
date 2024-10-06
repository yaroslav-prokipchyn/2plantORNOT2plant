package com.naveanalytics.user;

import com.naveanalytics.organization.Organization;

public interface AuthorizationServerService {
    String create(UserRequest user);

    void delete(String username);

    void update(UserRequest user);

    String getEmail(String username);

    void disable(String email);

    void activate(String email);

    String createOrganizationAppIntegration(Organization savedOrganization);

    void deleteOrganizationAppIntegration(Organization organization);
}
