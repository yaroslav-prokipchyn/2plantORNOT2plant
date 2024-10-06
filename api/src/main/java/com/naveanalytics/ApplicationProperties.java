package com.naveanalytics;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "aws")
public class ApplicationProperties {

        private String userPoolId;
        private String clientId;
        private String authorizationUrl;
        private String tokenUrl;
        private String region;
        private String environment;
        private String accountId;

}
