package com.naveanalytics.field.irrigation;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Irrigation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    UUID fieldId;
    LocalDate date;
    double value;
}
