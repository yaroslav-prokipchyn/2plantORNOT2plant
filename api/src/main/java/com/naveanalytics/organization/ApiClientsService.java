package com.naveanalytics.organization;

import com.naveanalytics.field.netcdf.FileSystemUtil;
import com.naveanalytics.user.AuthorizationServerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ApiClientsService {

    private OrganizationRepository organizationRepository;
    private AuthorizationServerService authorizationServerService;
    private FileSystemUtil fileSystemUtil;

    public void createApiClientsForOrganizationsIfMissing() {
        var organizations = organizationRepository.findAll();
        organizations.stream().filter(o -> o.getClientId() == null).forEach(this::createOrganizationAppIntegration);
    }

    public Organization createOrganizationAppIntegration(Organization organization) {
        var clientId = authorizationServerService.createOrganizationAppIntegration(organization);
        organization.setClientId(clientId);
        organizationRepository.save(organization);
        fileSystemUtil.createBucket(organization.getId().toString(), organization.getName(), organization.getId().toString(), clientId);
        return organization;
    }

    public void deleteOrganizationAppIntegration(Organization organization, Boolean deleteBucket) {
        authorizationServerService.deleteOrganizationAppIntegration(organization);
        fileSystemUtil.deleteBucketAndRoleAndPolicy(organization.getId().toString(), organization.getClientId(), deleteBucket);
        organization.setClientId(null);
        organizationRepository.save(organization);
    }
}
