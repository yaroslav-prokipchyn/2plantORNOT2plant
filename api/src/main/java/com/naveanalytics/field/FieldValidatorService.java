package com.naveanalytics.field;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Service
public class FieldValidatorService {

    public boolean isFieldCategoriesAreSubsetOfOrganizationCategories(List<AllowedFieldCategory> fieldCategories, List<AllowedFieldCategory> organizationCategories) {
        Map<String, AllowedFieldCategory> organizationCategoriesMap = new HashMap<>();

        for (AllowedFieldCategory category : organizationCategories) {
            organizationCategoriesMap.put(category.getName() + category.getKey(), category);
        }

        if (fieldCategories.size() > organizationCategories.size()) {
            return false;
        }

        for (AllowedFieldCategory fieldCategory : fieldCategories) {
            AllowedFieldCategory organizationCategory = organizationCategoriesMap.get(fieldCategory.getName() + fieldCategory.getKey());
            if (organizationCategory == null || !new HashSet<>(organizationCategory.getAllowedOptions()).containsAll(fieldCategory.getAllowedOptions())) {
                return false;
            }
        }

        return true;
    }
}
