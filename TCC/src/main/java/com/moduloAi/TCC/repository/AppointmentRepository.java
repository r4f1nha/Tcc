package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {}
