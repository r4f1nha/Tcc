package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Label;
import com.moduloAi.TCC.dto.LabelRequest;
import com.moduloAi.TCC.dto.LabelResponse;
import com.moduloAi.TCC.repository.LabelRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LabelService {

    private final LabelRepository labelRepository;

    public LabelService(LabelRepository labelRepository) {
        this.labelRepository = labelRepository;
    }

    public List<LabelResponse> list() {
        return labelRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public LabelResponse findById(Long id) {
        return labelRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Label not found: " + id));
    }

    public LabelResponse create(LabelRequest request) {
        Label label = new Label(request.name(), request.description(), request.color());
        return toResponse(labelRepository.save(label));
    }

    public LabelResponse update(Long id, LabelRequest request) {
        Label label = labelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Label not found: " + id));
        label.setName(request.name());
        label.setDescription(request.description());
        label.setColor(request.color());
        return toResponse(labelRepository.save(label));
    }

    public void delete(Long id) {
        if (!labelRepository.existsById(id)) {
            throw new EntityNotFoundException("Label not found: " + id);
        }
        labelRepository.deleteById(id);
    }

    private LabelResponse toResponse(Label label) {
        return new LabelResponse(label.getId(), label.getName(),
                label.getDescription(), label.getColor());
    }
}
