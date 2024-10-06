package com.naveanalytics.configs;

import com.naveanalytics.ApplicationProperties;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/configs")
@AllArgsConstructor
@Tag(name = "Cognito information", description = "Provides Cognito information to the frontend, to initialize login.")
public class ConfigController {
    ApplicationProperties applicationProperties;

    @GetMapping
    public WebAuthConfigs getConfigs() {
        return new WebAuthConfigs(applicationProperties.getClientId(), applicationProperties.getUserPoolId(), applicationProperties.getRegion());
    }
}
