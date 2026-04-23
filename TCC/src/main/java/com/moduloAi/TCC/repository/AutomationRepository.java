package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Automation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AutomationRepository extends JpaRepository<Automation, Long> {
    List<Automation> findByActiveTrue();
    List<Automation> findByEventAndActiveTrue(Automation.AutomationEvent event);
}
