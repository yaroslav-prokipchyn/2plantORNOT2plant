package com.naveanalytics.field.netcdf;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Log4j2
@Profile("!test")
public class ImportSchedulerImpl implements ImportScheduler {

    private GranuleImporter granuleImporter;

    @Scheduled(fixedDelayString = "${granuleImportRate}")
    public void importGranules() {
        log.debug("Importing granules");
        granuleImporter.importGranules();
    }
}
