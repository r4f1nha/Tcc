package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Lead;
import com.moduloAi.TCC.dto.LeadRequest;
import com.moduloAi.TCC.dto.LeadResponse;
import com.moduloAi.TCC.repository.LeadRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;

    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    public List<LeadResponse> list() {
        return leadRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public LeadResponse findById(Long id) {
        return leadRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found: " + id));
    }

    public LeadResponse create(LeadRequest request) {
        Lead lead = new Lead(request.name(), request.email(), request.cpf(), request.phone());
        return toResponse(leadRepository.save(lead));
    }

    public LeadResponse update(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found: " + id));
        lead.setName(request.name());
        lead.setEmail(request.email());
        lead.setCpf(request.cpf());
        lead.setPhone(request.phone());
        return toResponse(leadRepository.save(lead));
    }

    public void delete(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new EntityNotFoundException("Lead not found: " + id);
        }
        leadRepository.deleteById(id);
    }

    private LeadResponse toResponse(Lead lead) {
        return new LeadResponse(lead.getId(), lead.getName(), lead.getEmail(),
                lead.getCpf(), lead.getPhone());
    }
}
