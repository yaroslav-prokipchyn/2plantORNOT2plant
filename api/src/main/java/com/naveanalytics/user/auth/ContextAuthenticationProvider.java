package com.naveanalytics.user.auth;

import com.naveanalytics.user.CognitoAuthorizationServerService;
import com.naveanalytics.user.User;
import com.naveanalytics.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ContextAuthenticationProvider implements AuthenticationProvider {

    private final HttpServletRequest request;
    private final CognitoAuthorizationServerService authorizationServerService;
    private final UserRepository userRepository;

    @Value("${currentUserEmail}")
    private String currentUserEmail;

    public boolean isAdmin() {

        var user = getCurrentUser();
        var roleOptional = request.getHeader("Admin-Role");
        return Arrays.asList(user.getRoles()).contains(User.Role.admin) && (roleOptional == null || roleOptional.equals("admin"));
    }

    public boolean isAgronomist() {

        var user = getCurrentUser();
        var roleOptional = request.getHeader("Admin-Role");
        return Arrays.asList(user.getRoles()).contains(User.Role.agronomist) || ( Arrays.asList(user.getRoles()).contains(User.Role.admin) && "agronomist".equals(roleOptional));
    }

    public boolean isSuperAdmin() {
        var user = getCurrentUser();
        return Arrays.asList(user.getRoles()).contains(User.Role.super_admin);
    }

    @Override
    public User getCurrentUser() {

        var email = authorizationServerService.getEmail(currentUserEmail);
        return userRepository.getUserByEmail(email).orElseThrow(
                () -> new RuntimeException("User not found by email " + email));

    }
}
