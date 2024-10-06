package com.naveanalytics.organization;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController()
@RequestMapping("/organizations")
@AllArgsConstructor
@Tag(name = "Organization API")
public class OrganizationController {

    private final OrganizationService organizationService;
    private final OrganizationDeletionService organizationDeletionService;

    @GetMapping
    public List<OrganizationWithAdmins> getOrganizations() {
        return organizationService.getOrganizations();
    }

    @GetMapping("/{id}")
    public OrganizationWithAdmins getOrganization(@PathVariable UUID id) {
        return organizationService.getOrganization(id);
    }

    @PostMapping
    public Organization createOrganization(@RequestBody Organization organization) {
        return organizationService.createOrganization(organization);
    }

    @PutMapping("/{id}")
    public Organization updateOrganization(@PathVariable UUID id, @RequestBody Organization organization) {
        if (!Objects.equals(organization.getId(), id)) {
            throw new IllegalArgumentException("Id mismatch");
        }
        return organizationService.updateOrganization(organization);
    }

    @PutMapping("/{id}/lock")
    @Operation(summary = "Lock organization", description = "Lock organization, all fields should have crop provided and planting date in the past otherwise will fail.")
    public Organization lockOrganization(@PathVariable UUID id) {
        return organizationService.lockOrganization(id);
    }

    @PutMapping("/{id}/unlock")
    @Operation(summary = "Unlock organization", description = "Unlock organization available only for supper admin.")
    public Organization unlockOrganization(@PathVariable UUID id) {
        return organizationService.unlockOrganization(id);
    }

    @GetMapping("/{id}/is-ready-to-lock")
    @Operation(summary = "Check if organization is ready to lock", description = "Check if organization is ready to lock, returns a list of fields that are not ready for locking and messages with details." +
                                                                                 "If all fields are ready for locking, returns an empty list." +
                                                                                 "All fields should have crop provided and planting date in the past. "
    )
    public Map<UUID, List<String>> isReadyToLock(@PathVariable UUID id) {
        return organizationService.isReadyToLock(id);
    }

    @Tag(name = "Organization frontend api")
    @PostMapping("/with-admin")
    @Operation(summary = "Create organization with admin", description = "Create organization with admin user, also create organization in cognito and assign admin to the organization.")
    public Organization createOrganizationWithAdmin(@RequestBody OrganizationRequest organization) {
        return organizationService.createOrganizationWithAdmin(organization);
    }

    @Tag(name = "Organization frontend api")
    @PutMapping("/with-admin/{id}")
    @Operation(summary = "Update organization with admin", description = "Note: This rote can not change organization admin email. Use Put /organizations/{id} for that.")
    public Organization updateOrganizationWithAdmin(@PathVariable UUID id, @RequestBody OrganizationRequest organization) {
        return organizationService.updateOrganizationWithAdmin(id, organization);
    }

    @Operation(summary = "Delete organization", description = "Delete organization by id, Also delete all fields, irrigation data and users in the organization.")
    @DeleteMapping("/{id}")
    public void deleteOrganization(@PathVariable UUID id, @RequestParam(required = false) Boolean deleteBucket) {
        organizationDeletionService.deleteOrganization(id, deleteBucket);
    }
}
