package com.naveanalytics.configs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WebAuthConfigs {
    String clientId;
    String userPoolId;
    String region;
}
