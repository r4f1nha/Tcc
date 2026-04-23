package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.service.WebhookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/webhooks")
public class WebhookController {

    private final WebhookService webhookService;

    public WebhookController(WebhookService webhookService) {
        this.webhookService = webhookService;
    }

    @PostMapping("/waha")
    public ResponseEntity<Void> receiveWaha(@RequestBody Map<String, Object> payload) {
        webhookService.process(payload);
        return ResponseEntity.ok().build();
    }
}
