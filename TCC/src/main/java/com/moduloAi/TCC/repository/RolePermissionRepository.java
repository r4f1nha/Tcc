package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Permission;
import com.moduloAi.TCC.domain.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    List<RolePermission> findByRole(String role);

    Optional<RolePermission> findByRoleAndPermission(String role, Permission permission);
}