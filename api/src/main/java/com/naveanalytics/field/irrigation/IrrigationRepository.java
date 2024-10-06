package com.naveanalytics.field.irrigation;

import com.naveanalytics.field.irrigation.export.IrrigationWithOrgId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IrrigationRepository extends JpaRepository<Irrigation, Integer> {
    List<Irrigation> getIrrigationByFieldId(UUID fieldId);
    void deleteByFieldId(UUID fieldId);

    List<Irrigation> findAllByFieldId(UUID fieldId);



    List<Irrigation> findAllByOrderByFieldIdAscDateAsc();

    @Query("SELECT i FROM Irrigation i WHERE i.fieldId IN :fieldIds order by i.fieldId, i.date asc")
    List<Irrigation> findAllByFieldIdsOrderByFieldIdAscDateAsc(List<UUID> fieldIds);



    @Query("SELECT i FROM Irrigation i JOIN Field f ON i.fieldId = f.id WHERE f.organization.id = :orgId order by i.fieldId, i.date asc")
    List<Irrigation> findAllByField_OrganizationOrderByFieldIdAscDateAsc(UUID orgId);

    @Query("SELECT i FROM Irrigation i JOIN Field f ON i.fieldId = f.id WHERE f.organization.id = :orgId and i.fieldId in :fieldIds order by i.fieldId, i.date asc")
    List<Irrigation> findAllByFieldIdsInAndOrganizationId(List<UUID> fieldIds, UUID orgId);



    @Query("SELECT i FROM Irrigation i JOIN Field f ON i.fieldId = f.id WHERE f.agronomist.id = :agronomistId order by i.fieldId, i.date asc")
    List<Irrigation> findAllByField_AgronomistOrderByFieldIdAscDateAsc(Integer agronomistId);

    @Query("SELECT i FROM Irrigation i JOIN Field f ON i.fieldId = f.id WHERE f.agronomist.id = :agronomistId and i.fieldId in :fieldIds order by i.fieldId, i.date asc")
    List<Irrigation> findAllByFieldIdsAndAgronomistId(List<UUID> fieldIds, Integer agronomistId);



    @Query(value = "select distinct on(i.field_id) i.date,i.id,i.value,i.field_id from irrigation i where field_id in :fieldIds order by i.field_id,i.date desc", nativeQuery = true)
    List<Irrigation> findMostRecentIrrigationForFields(List<UUID> fieldIds);




    @Modifying
    @Query("UPDATE Irrigation i SET i.value = :value WHERE i.fieldId = :fieldId AND i.date = :date")
    int updateByDateAndFieldId(@Param("fieldId") UUID fieldId, @Param("date") LocalDate date, @Param("value") double value);


    /**
     * Note this method returns at least one record for each field, even if the field has no irrigation data.
     * So that it is possible to see all fields in export.
     *
     * @param orgIds if null, return all irrigation data for all organizations
     * @return List of IrrigationWithOrgId
     */
    @Query("""
        SELECT
            new com.naveanalytics.field.irrigation.export.IrrigationWithOrgId(f.id, i.id, o.id, i.date, i.value)
        FROM
            Field f
            LEFT JOIN Irrigation i ON f.id = i.fieldId
            JOIN Organization o ON o.id = f.organization.id
        WHERE
             :orgIds is null or o.id IN :orgIds
            AND o.locked = true
        ORDER BY
            f.id, i.date
    """)
    List<IrrigationWithOrgId> findIrrigationForFieldsOfOrganizationInAndLocked(List<UUID> orgIds);

    @Query("""
        SELECT
            i
        FROM
            Field f
            JOIN Irrigation i ON f.id = i.fieldId
            JOIN Organization o ON o.id = f.organization.id
        WHERE
             :orgIds is null or o.id IN :orgIds
        ORDER BY
            f.id, i.date
    """)
    List<Irrigation> findIrrigationForFieldsOfOrganizationIn(List<UUID> orgIds);

    Optional<Irrigation> findFirstByFieldIdAndDate(UUID fieldId, LocalDate date);
}
