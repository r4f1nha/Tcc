package com.moduloAi.TCC.repository;
import com.moduloAi.TCC.domain.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByStartAtLessThanAndEndAtGreaterThan(
            OffsetDateTime endAt,
            OffsetDateTime startAt
    );

    boolean existsByIdNotAndStartAtLessThanAndEndAtGreaterThan(
            Long id,
            OffsetDateTime endAt,
            OffsetDateTime startAt
    );
}
