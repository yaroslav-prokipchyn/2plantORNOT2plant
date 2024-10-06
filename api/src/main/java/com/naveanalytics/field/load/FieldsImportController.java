package com.naveanalytics.field.load;

import com.naveanalytics.field.Field;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

@AllArgsConstructor
@RequestMapping("/fields")
@RestController
@Log4j2
@Tag(name = "Fields shapefile Import API")
public class FieldsImportController {

    private final ImportService fieldImportService;

    @Operation(summary = "Upload shapefiles to import fields", description = "Upload shapefiles to import fields. Fields will be in organization of logged user.")
    @SneakyThrows
    @PostMapping(value = "/upload-shapefiles", consumes = "multipart/form-data")
    public List<Field> uploadShapefile(@RequestParam("files") List<MultipartFile> files) {

        String userHomeDir = System.getProperty("user.home");

        var timestamp = System.currentTimeMillis();
        String uploadDir = userHomeDir + "/shapefile-import/" + timestamp;
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            File destFile = new File(uploadDir + File.separator + fileName);
            file.transferTo(destFile);
        }

        var fields = fieldImportService.importFields(directory);
        delete(directory);
        return fields;
    }

    @SneakyThrows
    private void delete(File directory) {
        try (var walk = Files.walk(directory.toPath())) {
            var list = walk.sorted(Comparator.reverseOrder()).toList();
            for (Path path : list) {
                Files.delete(path);
            }
            log.debug("Directory deleted successfully.");
        }
    }

}
