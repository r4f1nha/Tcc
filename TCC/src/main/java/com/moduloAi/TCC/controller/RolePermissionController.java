package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.domain.RolePermission;
import com.moduloAi.TCC.dto.PermissionDTO;
import com.moduloAi.TCC.dto.PermissionResponseDTO;
import com.moduloAi.TCC.dto.UpdatePermissionDTO;
import com.moduloAi.TCC.service.RolePermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RolePermissionController {

    private final RolePermissionService service;

    public RolePermissionController(RolePermissionService service) {
        this.service = service;
    }

    @GetMapping("/{role}/permissions")
    public List<PermissionDTO> get(@PathVariable String role) {
        return service.getByRole(role);
    }

    @PutMapping("/{role}/permissions")
    public void update(
            @PathVariable String role,
            @RequestBody List<RolePermission> permissions
    ) {
        service.updatePermissions(role, permissions);
    }
}