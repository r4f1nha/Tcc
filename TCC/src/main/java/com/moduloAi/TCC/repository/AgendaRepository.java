package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendaRepository extends JpaRepository<Agenda, Long> {
}
