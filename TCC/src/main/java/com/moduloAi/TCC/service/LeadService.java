package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Lead;
import com.moduloAi.TCC.dto.LeadRequest;
import com.moduloAi.TCC.dto.LeadResponse;
import com.moduloAi.TCC.repository.LeadRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;

    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    public List<LeadResponse> list() {
        return leadRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public LeadResponse getById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found: " + id));

        return toResponse(lead);
    }

    public LeadResponse create(LeadRequest request) {
        validateRequest(request);

        Lead lead = new Lead();
        lead.setName(request.name());
        lead.setCompany(request.company());
        lead.setOrigin(request.origin());
        lead.setEmail(request.email());
        lead.setPhone(request.phone());
        lead.setValue(request.value());
        lead.setStage(request.stage());
        lead.setPriority(request.priority());
        lead.setStatus(request.stage());
        lead.setNextStep(request.nextStep());
        lead.setNotes(request.notes());
        lead.setCreatedAt(LocalDateTime.now());
        lead.setUpdatedAt(LocalDateTime.now());

        Lead saved = leadRepository.save(lead);
        return toResponse(saved);
    }

    public LeadResponse update(Long id, LeadRequest request) {
        validateRequest(request);

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found: " + id));

        lead.setName(request.name());
        lead.setCompany(request.company());
        lead.setOrigin(request.origin());
        lead.setEmail(request.email());
        lead.setPhone(request.phone());
        lead.setValue(request.value());
        lead.setStage(request.stage());
        lead.setPriority(request.priority());
        lead.setStatus(request.stage());
        lead.setNextStep(request.nextStep());
        lead.setNotes(request.notes());
        lead.setUpdatedAt(LocalDateTime.now());

        Lead updatedLead = leadRepository.save(lead);
        return toResponse(updatedLead);
    }

    public void delete(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found: " + id));

        leadRepository.delete(lead);
    }

    private LeadResponse toResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                lead.getCreatedAt(),
                lead.getUpdatedAt(),
                lead.getName(),
                lead.getCompany(),
                lead.getOrigin(),
                lead.getEmail(),
                lead.getPhone(),
                lead.getValue(),
                lead.getStage(),
                lead.getPriority(),
                lead.getStatus(),
                lead.getNextStep(),
                lead.getNotes()
        );
    }

    private void validateRequest(LeadRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("name is required");
        }

        if (request.stage() == null || request.stage().isBlank()) {
            throw new IllegalArgumentException("stage is required");
        }

        if (request.priority() == null || request.priority().isBlank()) {
            throw new IllegalArgumentException("priority is required");
        }
    }
}