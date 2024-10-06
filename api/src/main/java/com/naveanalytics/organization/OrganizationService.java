package com.naveanalytics.organization;

import com.naveanalytics.field.FieldRepository;
import com.naveanalytics.field.FieldValidatorService;
import com.naveanalytics.user.User;
import com.naveanalytics.user.UserRepository;
import com.naveanalytics.user.UserRequest;
import com.naveanalytics.user.UserService;
import com.naveanalytics.user.auth.AuthenticationProvider;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameExistsException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.naveanalytics.user.User.Role.admin;

@Service
@AllArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final AuthenticationProvider authenticationProvider;
    private final UserRepository userRepository;
    private final UserService userService;
    private final FieldRepository fieldRepository;
    private final FieldValidatorService fieldValidatorService;
    private final ApiClientsService apiClientsService;

    public List<OrganizationWithAdmins> getOrganizations() {
        List<Organization> organizations;
        if (authenticationProvider.isSuperAdmin()) {
            organizations = organizationRepository.findAllByOrderByName();
        } else {
            organizations = List.of(organizationRepository.findById(authenticationProvider.getCurrentUser().getOrganizationId())
                    .orElseThrow(() -> new IllegalStateException("Organization not found for user with organization id " + authenticationProvider.getCurrentUser().getOrganizationId())));
        }
        var admins = userRepository.findByRole(admin.toString());
        return organizations.stream().map(org -> mapToOrganizationWithAdmin(org, admins.stream().filter(a->a.getOrganizationId().equals(org.id)).toList())).toList();
    }

    public Organization createOrganization(Organization organization) {
        if (!authenticationProvider.isSuperAdmin()) {
            throw new SecurityException("Only super admin can create organization");
        }

        var saved = organizationRepository.save(organization);

        return apiClientsService.createOrganizationAppIntegration(saved);
    }

    public OrganizationWithAdmins getOrganization(UUID id) {
        if (!authenticationProvider.isSuperAdmin()
            && !Objects.equals(authenticationProvider.getCurrentUser().getOrganizationId(), id)) {
            throw new SecurityException("Only super admin or organization member can view organization");
        }
        var admins = userRepository.findByRole(admin.toString());
        return organizationRepository.findById(id).map(
                org -> mapToOrganizationWithAdmin(org,  admins.stream().filter(a -> org.id.equals(a.getOrganizationId())).toList())
        ).orElseThrow(() -> new IllegalArgumentException("Organization not found"));
    }

    @Transactional
    public Organization updateOrganization(Organization organization) {
        if (!authenticationProvider.isSuperAdmin()) {
            throw new SecurityException("Only super admin can create organization");
        }
        Organization existingOrganization = organizationRepository.findById(organization.id).orElseThrow(() -> new IllegalArgumentException("Organization not found"));
        existingOrganization.setName(organization.getName());
        existingOrganization.setAddress(organization.getAddress());
        existingOrganization.setPhone(organization.getPhone());
        existingOrganization.setCategories(organization.getCategories());

        updateFieldAccordingToOrganization(organization);

        return organizationRepository.save(existingOrganization);
    }

    private OrganizationWithAdmins mapToOrganizationWithAdmin(Organization org, List<User> admins) {
        return new OrganizationWithAdmins(
                org.getId(),
                org.getName(),
                org.getAddress(),
                org.getPhone(),
                admins,
                org.isLocked(),
                org.getLockedAt(),
                org.getClientId(),
                org.getCategories()
        );
    }

    @Transactional
    public Organization createOrganizationWithAdmin(OrganizationRequest organizationRequest) {
        userRepository.getUserByEmail(organizationRequest.getEmail()).ifPresent(user -> {
            throw UsernameExistsException.builder().message("User with email " + organizationRequest.getEmail() + " already exists").build();
        });

        var organization = new Organization();
        organization.name = organizationRequest.getName();
        organization.address = organizationRequest.getAddress();
        organization.phone = organizationRequest.getPhone();
        organization.categories = organizationRequest.getCategories();

        var savedOrganization = this.createOrganization(organization);
        userService.createUser(UserRequest.builder()
                .firstName(organizationRequest.getFirstName())
                .lastName(organizationRequest.getLastName())
                .email(organizationRequest.getEmail())
                .roles(List.of(admin))
                .organizationId(savedOrganization.getId())
                .build());

        return organization;
    }

    @Transactional
    public Organization updateOrganizationWithAdmin(UUID organizationId, OrganizationRequest organizationRequest) {
        if (!authenticationProvider.isSuperAdmin()) {
            throw new SecurityException("Only super admin can update organization");
        }

        var organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));
        organization.name = organizationRequest.getName();
        organization.address = organizationRequest.getAddress();
        organization.phone = organizationRequest.getPhone();
        organization.categories = organizationRequest.getCategories();

        updateFieldAccordingToOrganization(organization);

        var savedOrganization = organizationRepository.save(organization);

        var user = userRepository.getUserByEmail(organizationRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        userService.updateUser(user.getId(), UserRequest.builder()
                .firstName(organizationRequest.getFirstName())
                .lastName(organizationRequest.getLastName())
                .email(organizationRequest.getEmail())
                .roles(Arrays.asList(user.getRoles()))
                .organizationId(savedOrganization.getId())
                .build());
        return savedOrganization;
    }

    public Organization lockOrganization(UUID id) {
        if (!authenticationProvider.isSuperAdmin() && !authenticationProvider.isAdmin()) {
            throw new SecurityException("Only super admin or admin locks organization");
        }
        var validationErrors = isOrganizationCanByLocked(id);
        if (!validationErrors.isEmpty()) {
            throw new CanNotLockOrganizationException("Organization can not be locked. " + validationErrors);
        }

        Organization organization = organizationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Organization not found"));
        organization.setLocked(true);
        organization.setLockedAt(LocalDate.now());
        return organizationRepository.save(organization);
    }

    public Organization unlockOrganization(UUID id) {
        if (!authenticationProvider.isSuperAdmin()) {
            throw new SecurityException("Only super admin can unlock organization");
        }
        Organization organization = organizationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Organization not found"));
        organization.setLocked(false);
        organization.setLockedAt(null);
        return organizationRepository.save(organization);
    }

    private Map<UUID, List<String>> isOrganizationCanByLocked(UUID id) {
        return fieldRepository.findByOrganizationIdOrderByNameAsc(id).stream().map(field -> {
                    var messages = Map.entry(field.getId(), new ArrayList<String>());
                    if (field.getPlantedAt() == null || field.getPlantedAt().isAfter(LocalDate.now())) {
                        messages.getValue().add("Field '" + field.getName() + "' has no planting date or planting date is in the future");
                    }
                    if (field.getCrop() == null) {
                        messages.getValue().add("Field '" + field.getName() + "' has no crop");
                    }
                    return messages;
                })
                .filter(entry -> !entry.getValue().isEmpty())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public Map<UUID, List<String>> isReadyToLock(UUID id) {
        var user = authenticationProvider.getCurrentUser();
        if (authenticationProvider.isSuperAdmin() || user.getOrganizationId().equals(id)) {
            return isOrganizationCanByLocked(id);
        }
        throw new SecurityException("Only super admin or agronomist can check if organization is ready to lock");
    }

    public static class CanNotLockOrganizationException extends RuntimeException {
        public CanNotLockOrganizationException(String message) {
            super(message);
        }
    }

    private void updateFieldAccordingToOrganization(Organization organization) {
        var fields = fieldRepository.findByOrganizationIdOrderByNameAsc(organization.id);
        fields.forEach(field -> {
            if (!fieldValidatorService.isFieldCategoriesAreSubsetOfOrganizationCategories(field.getCategories(), organization.getCategories())) {
                field.setCategories(field.getCategories().stream()
                        .filter(category -> organization.getCategories().stream()
                                .anyMatch(organizationCategory -> organizationCategory.getName().equals(category.getName())
                                                                  && organizationCategory.getAllowedOptions().containsAll(category.getAllowedOptions())))
                        .toList());
                fieldRepository.save(field);
            }
        });
    }
}
