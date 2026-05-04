package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Permission;
import com.moduloAi.TCC.domain.RolePermission;
import com.moduloAi.TCC.dto.PermissionDTO;
import com.moduloAi.TCC.dto.PermissionResponseDTO;
import com.moduloAi.TCC.dto.UpdatePermissionDTO;
import com.moduloAi.TCC.repository.RolePermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolePermissionService {

    private final RolePermissionRepository repository;

    public RolePermissionService(RolePermissionRepository repository) {
        this.repository = repository;
    }

    public List<PermissionDTO> getByRole(String role) {
        return repository.findByRole(role.toUpperCase())
                .stream()
                .map(rp -> new PermissionDTO(
                        rp.getPermission().name(), // name
                        formatLabel(rp.getPermission().name()), // label
                        rp.getEnabled()
                ))
                .toList();
    }
    private String formatLabel(String name) {
        return switch (name) {
            case "DASHBOARD" -> "Dashboard";
            case "CONVERSATIONS" -> "Conversas";
            case "LEADS" -> "Leads";
            case "KANBAN" -> "Kanban";
            case "AGENDA" -> "Agenda";
            case "USERS" -> "Usuários";
            case "PERMISSIONS" -> "Permissões";
            case "SETTINGS" -> "Configurações";
            default -> name;
        };
    }

    public void updatePermissions(String role, List<RolePermission> permissions) {
        for (RolePermission p : permissions) {
            RolePermission rp = repository
                    .findByRoleAndPermission(role, p.getPermission())
                    .orElseThrow();

            rp.setEnabled(p.getEnabled());
            repository.save(rp);
        }
    }
    public boolean hasPermission(String role, Permission permission) {
        return repository.findByRoleAndPermission(role.toUpperCase(), permission)
                .map(RolePermission::getEnabled)
                .orElse(false);
    }
}