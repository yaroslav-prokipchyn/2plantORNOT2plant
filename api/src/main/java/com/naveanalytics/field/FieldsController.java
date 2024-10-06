package com.naveanalytics.field;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RequestMapping("/fields")
@RestController
@Tag(name = "Fields API")
public class FieldsController {

    private final FieldService fieldService;
    private final FieldDashboardExportService fieldDashboardExportService;

    @GetMapping()
    @Operation(summary = "Get fields", description = "Get fields, with irrigation data, optionally filter by name start with snippet.")
    public List<FieldWithIrrigation> getFields(@RequestParam(required = false) Optional<String> name) {
        return fieldService.getFieldsWithIrrigationData(name);
    }

    @Operation(summary = "Get fields by category", description = "Get fields by category, with irrigation data")
    @PostMapping("/category")
    public List<FieldWithIrrigation> getFieldsByCategoryWithIrrigation(@RequestBody AllowedFieldCategory allowedFieldCategory) {
        return fieldService.getFieldsByCategoryWithIrrigationData(allowedFieldCategory);
    }

    @Operation(summary = "Get fields by filter", description = "Get fields by filter, with irrigation data")
    @PostMapping("/filter")
    public List<FieldWithIrrigation> getFieldsByFilterWithIrrigation(@RequestBody FieldsFilter fieldsFilter) {
        return fieldService.getFieldsByFilterWithIrrigationData(fieldsFilter);
    }

    @GetMapping("/{id}")
    public FieldWithIrrigation getField(@PathVariable UUID id) {
        return fieldService.getFieldWithIrrigationData(id);
    }

    @PostMapping()
    public FieldWithIrrigation createField(@RequestBody FieldRequest field) {
        return fieldService.createFieldWithIrrigation(field);
    }

    @PutMapping("/{id}")
    public FieldWithIrrigation updateField(@PathVariable UUID id, @RequestBody FieldRequest field) {
        return fieldService.updateFieldWithIrrigation(id, field);
    }

    @DeleteMapping("/{id}")
    public void deleteField(@PathVariable UUID id) {
        fieldService.deleteField(id);
    }


    @Tag(name = "JSON Export API")
    @SecurityRequirement(name = "client-credential")
    @Operation(summary = "Export fields to JSON", description = """
            Use this export to get fields of locked organizations. \
            Specify organization ids to get fields of. Or keep list empty to get all fields of available locked organizations.""")
    @PostMapping("/export/json")
    public ResponseEntity<String> exportFieldsToJson(@RequestBody List<UUID> orgIds) {
        var headers = new HttpHeaders();
        headers.setContentDispositionFormData("filename", "fields.json");
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(fieldDashboardExportService.exportFieldsToJson(orgIds), headers, HttpStatus.OK);
    }

}
