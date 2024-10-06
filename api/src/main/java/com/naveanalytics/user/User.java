package com.naveanalytics.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.hypersistence.utils.hibernate.type.array.EnumArrayType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;

import javax.annotation.Nullable;
import java.io.Serial;
import java.io.Serializable;
import java.util.Arrays;
import java.util.UUID;

import static io.hypersistence.utils.hibernate.type.array.internal.AbstractArrayType.SQL_ARRAY_TYPE;

@Entity(name = "\"user\"")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable {
    @Serial
    private static final long serialVersionUID = 1905122041950251207L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    @NotNull
    private String email;
    @Type(value = EnumArrayType.class, parameters = @Parameter(name = SQL_ARRAY_TYPE, value = "user_role"))
    @NotNull
    private Role[] roles;
    @With
    @Nullable // can be null for super admin
    private UUID organizationId;
    private boolean active = true;

    public enum Role {
        super_admin,
        admin,
        agronomist
    }

    @Transient
    @JsonIgnore
    public boolean hasAdminRole() {
        return Arrays.asList(getRoles()).contains(User.Role.admin);
    }

    @Transient
    @JsonIgnore
    public boolean hesAgronomistRole() {
        return Arrays.asList(getRoles()).contains(User.Role.agronomist);
    }

    @Transient
    @JsonIgnore
    public boolean hesSuperAdmin() {
        return Arrays.asList(getRoles()).contains(User.Role.super_admin);
    }

}
