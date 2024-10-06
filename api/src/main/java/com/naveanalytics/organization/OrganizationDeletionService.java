package com.naveanalytics.organization;

import com.naveanalytics.field.FieldRepository;
import com.naveanalytics.field.irrigation.Irrigation;
import com.naveanalytics.field.irrigation.IrrigationRepository;
import com.naveanalytics.user.AuthorizationServerService;
import com.naveanalytics.user.UserRepository;
import com.naveanalytics.user.auth.AuthenticationProvider;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@Log4j2
public class OrganizationDeletionService {
    private final ApiClientsService apiClientsService;
    UserRepository userRepository;
    FieldRepository fieldRepository;
    OrganizationRepository organizationRepository;
    AuthenticationProvider authenticationProvider;
    private IrrigationRepository irrigationRepository;
    AuthorizationServerService authorizationServerService;

    @Transactional
    public void deleteOrganization(UUID organizationId, Boolean deleteBucket) {
        log.warn("Deleting organization with id: {}", organizationId);
        if (!authenticationProvider.isSuperAdmin()) {
            throw new SecurityException("Only supperAdmin can delete organizations");
        }

        var organization = organizationRepository.findById(organizationId).orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        //delete all irrigation data for the fields in organization
        log.warn("Deleting irrigation data for fields in organization: {}", organizationId);
        var irrigationDataToDelete = findIrrigationForFieldsOfOrganizationIn(organizationId);
        irrigationRepository.deleteAll(irrigationDataToDelete);

        //delete all fields in organization
        log.warn("Deleting fields in organization: {}", organizationId);
        fieldRepository.deleteAllByOrganizationId(organizationId);

        //delete all users in organization
        var organizationUsers = userRepository.getUserByOrganizationId(organizationId);
        log.warn("Disabling users: {} in cognito", organizationUsers);
        organizationUsers.forEach(u -> authorizationServerService.delete(u.getEmail()));
        log.warn("Deleting users: {} in database", organizationUsers);
        userRepository.deleteAllByOrganizationId(organizationId);

        apiClientsService.deleteOrganizationAppIntegration(organization, deleteBucket);

        //delete organization
        log.warn("Deleting organization: {}", organizationId);
        organizationRepository.deleteById(organizationId);
    }

    public List<Irrigation> findIrrigationForFieldsOfOrganizationIn(UUID orgId) {
        if (authenticationProvider.isSuperAdmin()) {
            return irrigationRepository.findIrrigationForFieldsOfOrganizationIn(List.of(orgId));
        }
        throw new SecurityException("User does not have permission to view irrigation data for the specified organization");
    }

}
