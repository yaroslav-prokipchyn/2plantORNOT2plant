package com.naveanalytics.crop;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Crop {
    @Id
    String id;
    String name;

}
