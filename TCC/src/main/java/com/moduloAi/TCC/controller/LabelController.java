package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.dto.LabelRequest;
import com.moduloAi.TCC.dto.LabelResponse;
import com.moduloAi.TCC.service.LabelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/labels")
public class LabelController {

    private final LabelService labelService;

    public LabelController(LabelService labelService) {
        this.labelService = labelService;
    }

    @GetMapping
    public ResponseEntity<List<LabelResponse>> list() {
        return ResponseEntity.ok(labelService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabelResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(labelService.findById(id));
    }

    @PostMapping
    public ResponseEntity<LabelResponse> create(@RequestBody @Valid LabelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labelService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabelResponse> update(@PathVariable Long id,
                                                @RequestBody @Valid LabelRequest request) {
        return ResponseEntity.ok(labelService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        labelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
