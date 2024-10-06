package com.naveanalytics.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> getUserByEmail(String email);

    Optional<User> findByOrganizationIdAndId(UUID organizationId, Integer id);

    @Query(value = "SELECT * FROM \"user\" u WHERE :role\\:\\:user_role = any(u.roles) ORDER BY u.last_name, u.first_name", nativeQuery = true)
    List<User> findByRole(@Param("role") String role);

    @Query(value = "SELECT * FROM \"user\" u WHERE :role\\:\\:user_role = any(u.roles) AND u.organization_id = :orgId ORDER BY u.last_name, u.first_name", nativeQuery = true)
    List<User> findByRoleAndOrganizationId(@Param("role") String role, @Param("orgId") UUID orgId);

    @Query(value = "SELECT * FROM \"user\" u WHERE :role\\:\\:user_role = any(u.roles) and u.active = :active ORDER BY u.last_name, u.first_name", nativeQuery = true)
    List<User> findByRoleAndActive(@Param("role") String role, @Param("active") boolean active);

    @Query(value = "SELECT * FROM \"user\" u WHERE :role\\:\\:user_role = any(u.roles) AND u.organization_id = :orgId and u.active = :active ORDER BY u.last_name, u.first_name", nativeQuery = true)
    List<User> findByRoleAndOrganizationIdAndActive(@Param("role") String role, @Param("orgId") UUID orgId, @Param("active") boolean active);

    void deleteAllByOrganizationId(UUID organizationId);

    List<User> getUserByOrganizationId(UUID organizationId);
}
