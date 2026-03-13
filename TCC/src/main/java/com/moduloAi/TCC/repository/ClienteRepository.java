package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
