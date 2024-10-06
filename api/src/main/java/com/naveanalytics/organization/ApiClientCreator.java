package com.naveanalytics.organization;

import com.naveanalytics.ApplicationProperties;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ApiClientCreator {

    private final ApiClientsService apiClientsService;
    private final ApplicationProperties applicationProperties;

    @PostConstruct
    public void createApiClientsForOrganizationsIfMissing() {
        if (!applicationProperties.getEnvironment().equals("local")) {
            apiClientsService.createApiClientsForOrganizationsIfMissing();
        }
    }

}
