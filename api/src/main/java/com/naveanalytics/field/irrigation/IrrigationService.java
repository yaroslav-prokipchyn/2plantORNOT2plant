package com.naveanalytics.field.irrigation;

import com.naveanalytics.field.FieldService;
import com.naveanalytics.user.auth.AuthenticationProvider;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class IrrigationService {

    private final IrrigationRepository irrigationRepository;
    private final FieldService fieldService;
    private final AuthenticationProvider authenticationProvider;

    public List<Irrigation> getIrrigationData(UUID fieldId) {
        try {
            fieldService.getField(fieldId);
        } catch (SecurityException e) {
            throw new SecurityException("User does not have permission to view irrigation data");
        }
        return irrigationRepository.findAllByFieldId(fieldId);
    }

    public Irrigation createIrrigation(IrrigationRequest irrigationRequest) {

        try {
            fieldService.getField(irrigationRequest.getFieldId());
        } catch (SecurityException e) {
            throw new SecurityException("User does not have permission to view irrigation data");
        }

        var existingIrrigation = irrigationRepository.findFirstByFieldIdAndDate(irrigationRequest.getFieldId(), irrigationRequest.getDate());
        if (existingIrrigation.isPresent()) {
            if (irrigationRequest.getValue() == null) {
                irrigationRepository.deleteById(existingIrrigation.get().id);
                return null;
            } else {
                existingIrrigation.get().setValue(irrigationRequest.getValue());
                return irrigationRepository.save(existingIrrigation.get());
            }
        }

        if (irrigationRequest.getValue() != null) {
            var irrigation = new Irrigation();
            irrigation.setFieldId(irrigationRequest.getFieldId());
            irrigation.setDate(irrigationRequest.getDate());
            irrigation.setValue(irrigationRequest.getValue());
            return irrigationRepository.save(irrigation);
        }
        return null;
    }

    public List<Irrigation> getIrrigation(Optional<List<UUID>> fieldIds) {
        var currentUser = authenticationProvider.getCurrentUser();
        if (fieldIds.isEmpty()) {
            if (authenticationProvider.isSuperAdmin()) {
                return irrigationRepository.findAllByOrderByFieldIdAscDateAsc();
            }
            if (authenticationProvider.isAdmin()) {
                return irrigationRepository.findAllByField_OrganizationOrderByFieldIdAscDateAsc(currentUser.getOrganizationId());
            }
            if (authenticationProvider.isAgronomist()) {
                return irrigationRepository.findAllByField_AgronomistOrderByFieldIdAscDateAsc(currentUser.getId());
            }
        }
        if (authenticationProvider.isSuperAdmin()) {
            return irrigationRepository.findAllByFieldIdsOrderByFieldIdAscDateAsc(fieldIds.get());
        }
        if (authenticationProvider.isAdmin()) {
            return irrigationRepository.findAllByFieldIdsInAndOrganizationId(fieldIds.get(), currentUser.getOrganizationId());
        }

        return irrigationRepository.findAllByFieldIdsAndAgronomistId(fieldIds.get(), currentUser.getId());
    }

    @Transactional
    public void updateIrrigationList(List<IrrigationRequest> irrigationRequestList) {
        irrigationRequestList.forEach(ir -> {
            try {
                var field = fieldService.getField(ir.getFieldId());
                irrigationRepository.findFirstByFieldIdAndDate(field.getId(), ir.getDate())
                        .ifPresentOrElse(fieldIrrigation -> {
                            if (ir.getValue() == null) {
                                deleteIrrigation(fieldIrrigation.getId());
                            } else {
                                updateIrrigation(ir);
                            }
                        },
                        () -> {
                            if (ir.getValue() != null) {
                                createIrrigation(ir);
                            }
                        });
            } catch (SecurityException e) {
                throw new SecurityException("User does not have permission to view irrigation data");
            }
        });
    }

    private void deleteIrrigation(Integer irrigationId) {
        irrigationRepository.deleteById(irrigationId);
    }

    private int updateIrrigation(IrrigationRequest irrigationRequest) {
        return irrigationRepository.updateByDateAndFieldId(irrigationRequest.getFieldId(), irrigationRequest.getDate(), irrigationRequest.getValue());
    }
}
