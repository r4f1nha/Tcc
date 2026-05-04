package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Permission;
import com.moduloAi.TCC.domain.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {

    boolean existsByUserIdAndPermission(Long userId, Permission permission);
}