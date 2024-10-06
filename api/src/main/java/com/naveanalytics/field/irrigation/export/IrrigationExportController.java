package com.naveanalytics.field.irrigation.export;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RequestMapping("/fields")
@RestController
@Tag(name = "JSON Export API")
public class IrrigationExportController {

    private IrrigationJsonExportService irrigationJsonExportService;

    @SecurityRequirement(name = "client-credential")
    @Operation(summary = "Export irrigation data to JSON", description = """
            Export irrigation data for fields of locked organizations to JSON, specified by organization IDs.\
            If no organization IDs are specified, all locked organizations are included.""")
    @PostMapping("/export/irrigation/json")
    public ResponseEntity<String> exportIrrigationDataToJson(@RequestBody(required = false) List<UUID> orgIds) {
        var headers = new HttpHeaders();
        headers.setContentDispositionFormData("filename", "irrigation.json");
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(irrigationJsonExportService.exportIrrigationDataToJson(orgIds), headers, HttpStatus.OK);
    }


}
