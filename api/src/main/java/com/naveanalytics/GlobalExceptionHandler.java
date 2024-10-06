package com.naveanalytics;


import com.naveanalytics.organization.OrganizationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameExistsException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public void handleUsernameExistsException(UsernameExistsException ex) {
    }

    @ExceptionHandler(SecurityException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public void handleSecurityException(SecurityException ex) {
    }

    @ExceptionHandler(OrganizationService.CanNotLockOrganizationException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public void handleCanNotLockOrganizationException(OrganizationService.CanNotLockOrganizationException ex) {
    }
}
