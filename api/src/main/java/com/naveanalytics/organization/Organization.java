package com.naveanalytics.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.naveanalytics.field.AllowedFieldCategory;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    String name;
    String address;
    String phone;
    boolean locked;

    @NotNull
    @Type(JsonType.class)
    List<AllowedFieldCategory> categories = List.of();

    @JsonIgnore
    public LocalDate lastImportDate = LocalDate.of(1980, 1, 1);

    public LocalDate lockedAt = null;
    public String clientId;
}
