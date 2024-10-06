package com.naveanalytics.user;

import com.naveanalytics.ApplicationProperties;
import com.naveanalytics.organization.Organization;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminUpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolClientRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CreateUserPoolClientResponse;

import static software.amazon.awssdk.services.cognitoidentityprovider.model.OAuthFlowType.CLIENT_CREDENTIALS;

@Log4j2
@AllArgsConstructor
@Service
public class CognitoAuthorizationServerService implements AuthorizationServerService {

    private final ApplicationProperties applicationProperties;

    @Override
    public String create(UserRequest user) {
        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {

            var createUserRequest = AdminCreateUserRequest.builder()
                    .userPoolId(applicationProperties.getUserPoolId())
                    .username(user.getEmail())
                    .userAttributes(
                            AttributeType.builder().name("given_name").value(user.getFirstName().trim()).build(),
                            AttributeType.builder().name("family_name").value(user.getLastName().trim()).build(),
                            AttributeType.builder().name("email").value(user.getEmail().trim()).build(),
                            AttributeType.builder().name("email_verified").value("true").build()
                    ).build();
            return cognitoClient.adminCreateUser(createUserRequest).user().username();
        }
    }

    @Override
    public void update(UserRequest user) {
        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {

            var adminUpdateUserAttributesRequest = AdminUpdateUserAttributesRequest.builder()
                    .userPoolId(applicationProperties.getUserPoolId())
                    .username(user.getEmail())
                    .userAttributes(
                            AttributeType.builder().name("given_name").value(user.getFirstName().trim()).build(),
                            AttributeType.builder().name("family_name").value(user.getLastName().trim()).build(),
                            AttributeType.builder().name("email").value(user.getEmail().trim()).build()
                    ).build();
            cognitoClient.adminUpdateUserAttributes(adminUpdateUserAttributesRequest);
        }
    }

    @Override
    public void delete(String email) {
        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {
            cognitoClient.adminUserGlobalSignOut(cognitoUser -> cognitoUser.username(email).userPoolId(applicationProperties.getUserPoolId()));
            cognitoClient.adminDeleteUser(cognitoUser -> cognitoUser.username(email).userPoolId(applicationProperties.getUserPoolId()));
        }
    }

    @Override
    public String getEmail(String userName) {
        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {
            var adminGetUserResponse = cognitoClient.adminGetUser(cognitoUser -> cognitoUser.username(userName).userPoolId(applicationProperties.getUserPoolId()));
            if (Boolean.FALSE.equals(adminGetUserResponse.enabled())) {
                throw new IllegalStateException("User is disabled");
            }
            return adminGetUserResponse
                    .userAttributes().stream().filter(attr -> attr.name().equals("email")).map(AttributeType::value).findFirst()
                    .orElseThrow(() -> new IllegalStateException("Can not fetch email from cognito for user " + userName));
        }
    }

    @Override
    public void disable(String email) {
        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {
            cognitoClient.adminUserGlobalSignOut(cognitoUser -> cognitoUser.username(email.trim()).userPoolId(applicationProperties.getUserPoolId()));
            cognitoClient.adminDisableUser(cognitoUser -> cognitoUser.username(email.trim()).userPoolId(applicationProperties.getUserPoolId()));
        }
    }

    @Override
    public void activate(String email) {
        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {
            cognitoClient.adminEnableUser(cognitoUser -> cognitoUser.username(email.trim()).userPoolId(applicationProperties.getUserPoolId()));
        }
    }

    @Override
    public String createOrganizationAppIntegration(Organization savedOrganization) {
        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {


            String userPoolId = applicationProperties.getUserPoolId();
            String organizationId = savedOrganization.getId().toString();

            CreateUserPoolClientRequest request = CreateUserPoolClientRequest.builder()
                    .userPoolId(userPoolId)
                    .clientName(organizationId)
                    .generateSecret(true)
                    .allowedOAuthFlows(CLIENT_CREDENTIALS)
                    .allowedOAuthFlowsUserPoolClient(true)
                    .allowedOAuthScopes(applicationProperties.getEnvironment()+"-nave-app-identifier/api_org_access")
                    .build();

            CreateUserPoolClientResponse response = cognitoClient.createUserPoolClient(request);
            return response.userPoolClient().clientId();
        }
    }

    @Override
    public void deleteOrganizationAppIntegration(Organization organization) {

        try (CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(applicationProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {
            cognitoClient.deleteUserPoolClient(cognitoUserPoolClientRequest -> cognitoUserPoolClientRequest.clientId(organization.clientId).userPoolId(applicationProperties.getUserPoolId()));
        }
    }
}
