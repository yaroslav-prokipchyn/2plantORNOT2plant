package com.naveanalytics.field.irrigation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RequestMapping("/fields")
@RestController
@Tag(name = "Irrigation API")
@SecurityRequirement(name = "client-credential")
public class IrrigationController {

    private IrrigationService irrigationService;

    @Operation(summary = "Get irrigation data for a field")
    @GetMapping("/{fieldId}/irrigation")
    public List<Irrigation> getIrrigationData(@PathVariable UUID fieldId) {
        return irrigationService.getIrrigationData(fieldId);
    }

    @Operation(summary = """
            Adds irrigation for a field for specific date, with specific amount of water (mm). \
            If irrigation already exists for the date, it will be updated. \
            If value is null, irrigation will be deleted.""")
    @PostMapping("/irrigation")
    public Irrigation createIrrigation(@RequestBody IrrigationRequest irrigationRequest) {
        return irrigationService.createIrrigation(irrigationRequest);
    }

    @Operation(summary = "Get irrigation data for all fields, or for specific fields if fieldIds are provided.")
    @PostMapping("/irrigation/all")
    public List<Irrigation> getIrrigation(@RequestBody(required = false) Optional<List<UUID>> fieldIds) {
        return irrigationService.getIrrigation(fieldIds);
    }

    @Operation(summary = "Update irrigation data for multiple fields", description = "If irrigation already exists for the date and field, it will be updated. If value is null, irrigation will be deleted.")
    @PutMapping("/irrigation/update")
    public void updateIrrigation(@RequestBody List<IrrigationRequest> irrigationRequestList) {
        irrigationService.updateIrrigationList(irrigationRequestList);
    }
}
