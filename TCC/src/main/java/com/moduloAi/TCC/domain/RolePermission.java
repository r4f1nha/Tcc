package com.moduloAi.TCC.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "role_permissions")
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;

    @Enumerated(EnumType.STRING)
    private Permission permission;

    private Boolean enabled;

}