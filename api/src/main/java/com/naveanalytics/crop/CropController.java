package com.naveanalytics.crop;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/crops")
@AllArgsConstructor
@Tag(name = "Crops API", description = "Provides information about crops.")
public class CropController {

    private final CropService cropService;

    @GetMapping()
    public List<Crop> getCrops() {
        return cropService.getCrops();
    }

}
