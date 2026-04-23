package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {
}