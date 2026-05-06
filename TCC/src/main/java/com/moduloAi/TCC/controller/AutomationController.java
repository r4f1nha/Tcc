package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.dto.AutomationRequest;
import com.moduloAi.TCC.dto.AutomationResponse;
import com.moduloAi.TCC.service.AutomationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/automations")
public class AutomationController {

    private final AutomationService automationService;

    public AutomationController(AutomationService automationService) {
        this.automationService = automationService;
    }

    @GetMapping
    public List<AutomationResponse> list() {
        return automationService.list();
    }

    @GetMapping("/{id}")
    public AutomationResponse getById(@PathVariable Long id) {
        return automationService.findById(id);
    }

    @PostMapping
    public AutomationResponse create(@Valid @RequestBody AutomationRequest request) {
        return automationService.create(request);
    }

    @PatchMapping("/{id}")
    public AutomationResponse update(@PathVariable Long id,
                                     @Valid @RequestBody AutomationRequest request) {
        return automationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        automationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public AutomationResponse toggle(@PathVariable Long id) {
        return automationService.toggle(id);
    }
}
