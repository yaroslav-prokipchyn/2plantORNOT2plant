package com.naveanalytics.field;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FieldRepository extends JpaRepository<Field, UUID> {
    @EntityGraph(attributePaths = {"organization", "agronomist", "crop"})
    List<Field> findAllByOrderByNameAsc();

    @EntityGraph(attributePaths = {"organization", "agronomist", "crop"})
    List<Field> findByAgronomistIdOrderByNameAsc(int agronomistId);

    @EntityGraph(attributePaths = {"organization", "agronomist", "crop"})
    List<Field> findByOrganizationIdOrderByNameAsc(UUID organizationId);

    @EntityGraph(attributePaths = {"organization", "agronomist", "crop"})
    @Query(value = """
            SELECT f FROM Field f WHERE \
            (:agronomistId is null or f.agronomist.id = :agronomistId) \
            AND ( Cast(:organizationId as string) is null or f.organization.id = :organizationId) \
            AND ( Cast(:names as string) is null or (f.name in (:names))) \
            AND ( Cast(:crops as string ) is NULL or f.crop.id in (:crops)) \
            AND ( Cast(:nameLike as string ) is null or (LOWER(f.name) LIKE LOWER(CONCAT(Cast(:nameLike as string ), '%')) OR LOWER(f.name) LIKE LOWER(CONCAT('% ', Cast(:nameLike as string ), '%')))) \
             order by f.name asc""")
    List<Field> findByAgronomistIdAndNameStartingWithIgnoreCase(Integer agronomistId, String nameLike, UUID organizationId, List<String> names, List<String> crops);


    void deleteAllByOrganizationId(UUID organizationId);

    List<Field> findByAgronomistId(Integer id);
}
