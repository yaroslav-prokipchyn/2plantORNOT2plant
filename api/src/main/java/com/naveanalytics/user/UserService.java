package com.naveanalytics.user;

import com.naveanalytics.field.FieldService;
import com.naveanalytics.user.auth.AuthenticationProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService {

    private final UserRepository userRepository;
    private final AuthorizationServerService authorizationServerService;
    private final AuthenticationProvider authenticationProvider;

    private FieldService fieldService;

    @Autowired
    public void setFieldService(@Lazy FieldService fieldService) {
        this.fieldService = fieldService;
    }

    public User getUser(int id) {
        var currentUser = authenticationProvider.getCurrentUser();
        if (authenticationProvider.isSuperAdmin()) {
            return userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found."));
        }
        return userRepository.findByOrganizationIdAndId(currentUser.getOrganizationId(), id)
                .orElseThrow(() -> new SecurityException("User not found or not authorized to view this user."));
    }

    public User getCurrentUser() {
        return authenticationProvider.getCurrentUser();
    }

    public List<User> getUsersByRole(User.Role role) {
        var currentUser = authenticationProvider.getCurrentUser();
        if (authenticationProvider.isSuperAdmin()) {
            return userRepository.findByRole(role.toString());
        }
        return userRepository.findByRoleAndOrganizationId(role.toString(), currentUser.getOrganizationId());
    }

    public List<User> getUsersByRoleAndStatus(User.Role role, boolean active) {
        var currentUser = authenticationProvider.getCurrentUser();
        if (authenticationProvider.isSuperAdmin()) {
            return userRepository.findByRoleAndActive(role.toString(), active);
        }
        return userRepository.findByRoleAndOrganizationIdAndActive(role.toString(), currentUser.getOrganizationId(), active);
    }

    public User updateUser(Integer id, UserRequest newUser) {
        var currentUser = authenticationProvider.getCurrentUser();
        var userToUpdate = this.getUser(id);

        if (!userToUpdate.getEmail().equals(newUser.getEmail())) {
            throw new IllegalArgumentException("You are not allowed to change user email.");
        }

        if (authenticationProvider.isSuperAdmin()) {
            return updateUser(newUser, userToUpdate);
        }

        if (authenticationProvider.isAdmin() && currentUser.getOrganizationId().equals(newUser.getOrganizationId()) && Objects.equals(userToUpdate.getOrganizationId(), newUser.getOrganizationId())
            && (newUser.getRoles().equals(Arrays.asList(userToUpdate.getRoles())))
            && userToUpdate.hesAgronomistRole()) {
            return updateUser(newUser, userToUpdate);
        }

        throw new SecurityException("You are not authorized to update this user.");
    }

    private User updateUser(UserRequest newUser, User userToUpdate) {
        authorizationServerService.update(newUser);
        updateUserDto(userToUpdate, newUser);
        return userRepository.save(userToUpdate);
    }

    @Transactional
    public User createUser(UserRequest user) {
        var currentUser = authenticationProvider.getCurrentUser();
        if (authenticationProvider.isSuperAdmin()
            || authenticationProvider.isAdmin() && user.getOrganizationId().equals(currentUser.getOrganizationId()) && user.isAgronomist()) {

            if (user.isAdmin() && user.getOrganizationId() == null) {
                throw new IllegalArgumentException("Admin user must have an organization id.");
            }

            var username = authorizationServerService.create(user);
            var userToSave = createUserToSave(user);
            try {
                return userRepository.save(userToSave);
            } catch (Exception ex) {
                authorizationServerService.delete(username);
                throw ex;
            }
        }
        throw new SecurityException("You are not authorized to create this user. check your roles and user organization and user role");
    }

    private void updateUserDto(User userToUpdate, UserRequest user) {
        userToUpdate.setEmail(user.getEmail().trim());
        userToUpdate.setFirstName(user.getFirstName().trim());
        userToUpdate.setLastName(user.getLastName().trim());
        userToUpdate.setOrganizationId(user.getOrganizationId());
        userToUpdate.setRoles(user.getRoles().toArray(new User.Role[0]));
    }

    private User createUserToSave(UserRequest user) {
        var userToSave = new User();
        userToSave.setEmail(user.getEmail().trim());
        userToSave.setFirstName(user.getFirstName().trim());
        userToSave.setLastName(user.getLastName().trim());
        userToSave.setOrganizationId(user.getOrganizationId());
        userToSave.setRoles(user.getRoles().toArray(new User.Role[0]));
        return userToSave;
    }

    @Transactional
    public void deleteUser(int id) {
        var user = this.getUser(id);
        var currentUser = authenticationProvider.getCurrentUser();
        if (authenticationProvider.isSuperAdmin()
            || authenticationProvider.isAdmin() && Objects.equals(user.getOrganizationId(), currentUser.getOrganizationId()) && user.hesAgronomistRole()) {

            if (authenticationProvider.isAdmin()) {
                fieldService.getByAgronomistId(user).forEach(field -> fieldService.reassignField(currentUser, field));
            } else {
                fieldService.getByAgronomistId(user).forEach(field -> fieldService.reassignField(null, field));
            }
            authorizationServerService.delete(user.getEmail());
            userRepository.deleteById(id);
        } else {
            throw new SecurityException("You are not authorized to delete this user.");
        }
    }

    public User updateUserStatus(int id, boolean active) {
        var user = this.getUser(id);
        var currentUser = authenticationProvider.getCurrentUser();
        if (authenticationProvider.isSuperAdmin()
            || authenticationProvider.isAdmin() && Objects.equals(user.getOrganizationId(), currentUser.getOrganizationId()) && user.hesAgronomistRole()) {
            if (!active) {
                authorizationServerService.disable(user.getEmail());
            } else {
                authorizationServerService.activate(user.getEmail());
            }
            user.setActive(active);
            return userRepository.save(user);
        } else {
            throw new SecurityException("You are not authorized to update this user.");
        }
    }
}
