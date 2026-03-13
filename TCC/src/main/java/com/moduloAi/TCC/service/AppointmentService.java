package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Appointment;
import com.moduloAi.TCC.domain.Lead;
import com.moduloAi.TCC.dto.AppointmentRequest;
import com.moduloAi.TCC.dto.AppointmentResponse;
import com.moduloAi.TCC.repository.AppointmentRepository;
import com.moduloAi.TCC.repository.LeadRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final LeadRepository leadRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              LeadRepository leadRepository) {
        this.appointmentRepository = appointmentRepository;
        this.leadRepository = leadRepository;
    }

    public List<AppointmentResponse> list() {
        return appointmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AppointmentResponse findById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found: " + id));
    }

    public AppointmentResponse create(AppointmentRequest request) {
        Lead lead = leadRepository.findById(request.leadId())
                .orElseThrow(() -> new EntityNotFoundException("Lead not found: " + request.leadId()));

        Appointment appointment = new Appointment(lead, request.title(),
                request.description(), request.startAt(), request.endAt());
        return toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponse update(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found: " + id));

        Lead lead = leadRepository.findById(request.leadId())
                .orElseThrow(() -> new EntityNotFoundException("Lead not found: " + request.leadId()));

        appointment.setLead(lead);
        appointment.setTitle(request.title());
        appointment.setDescription(request.description());
        appointment.setStartAt(request.startAt());
        appointment.setEndAt(request.endAt());
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
                appointment.getLead().getId(),
                appointment.getLead().getName(),
                appointment.getTitle(),
                appointment.getDescription(),
                appointment.getStartAt(),
                appointment.getEndAt()
        );
    }
}
