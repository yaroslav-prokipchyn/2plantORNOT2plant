package com.naveanalytics.crop;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CropService {

    private final CropRepository cropRepository;

    public List<Crop> getCrops() {
        return cropRepository.findAllByOrderByNameAsc();
    }

}
