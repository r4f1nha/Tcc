package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Permission;
import com.moduloAi.TCC.domain.UserPermission;
import com.moduloAi.TCC.repository.UserPermissionRepository;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {

    private final UserPermissionRepository repository;

    public PermissionService(UserPermissionRepository repository) {
        this.repository = repository;
    }

    public boolean hasPermission(Long userId, Permission permission) {
        return repository.existsByUserIdAndPermission(userId, permission);
    }

    public void addPermission(Long userId, Permission permission) {
        UserPermission up = new UserPermission();
        up.setUserId(userId);
        up.setPermission(permission);
        repository.save(up);
    }
}