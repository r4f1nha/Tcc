package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Appointment;
import com.moduloAi.TCC.dto.AppointmentRequest;
import com.moduloAi.TCC.dto.AppointmentResponse;
import com.moduloAi.TCC.repository.AppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<AppointmentResponse> list() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AppointmentResponse findById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found: " + id));
    }

    public AppointmentResponse create(AppointmentRequest request) {
        Appointment appointment = new Appointment(
                request.title(),
                request.description(),
                request.serviceType(),
                request.startAt(),
                request.endAt()
        );

        if (appointmentRepository.existsByStartAtLessThanAndEndAtGreaterThan(
                request.endAt(),
                request.startAt()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um agendamento nesse horário."
            );
        }

        return toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponse update(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found: " + id));

        appointment.setTitle(request.title());
        appointment.setDescription(request.description());
        appointment.setServiceType(request.serviceType());
        appointment.setStartAt(request.startAt());
        appointment.setEndAt(request.endAt());

        if (appointmentRepository.existsByIdNotAndStartAtLessThanAndEndAtGreaterThan(
                id,
                request.endAt(),
                request.startAt()
        )) {


            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um agendamento nesse horário."
            );
        }

        return toResponse(appointmentRepository.save(appointment));
    }

    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Appointment not found: " + id);
        }

        appointmentRepository.deleteById(id);
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getTitle(),
                appointment.getDescription(),
                appointment.getServiceType(),
                appointment.getStartAt(),
                appointment.getEndAt()
        );
    }
}