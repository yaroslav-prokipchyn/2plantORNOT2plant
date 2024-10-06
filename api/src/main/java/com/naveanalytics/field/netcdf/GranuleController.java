package com.naveanalytics.field.netcdf;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/granule")
@AllArgsConstructor
@Tag(name = "Granule API")
public class GranuleController {

    private GranuleImporter granuleImporter;

    @GetMapping("/import")
    public void importGranules() {
        granuleImporter.importGranules();
    }
}
