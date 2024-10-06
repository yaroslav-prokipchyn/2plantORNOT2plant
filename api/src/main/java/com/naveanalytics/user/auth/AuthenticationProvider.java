package com.naveanalytics.user.auth;

import com.naveanalytics.user.User;

import javax.annotation.Nullable;

public interface AuthenticationProvider {

    @Nullable
    User getCurrentUser();

    boolean isAdmin();

    boolean isAgronomist();

    boolean isSuperAdmin();

}
