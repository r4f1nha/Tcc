package com.moduloAi.TCC.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class WahaApiService {

    private final WebClient webClient;
    private final String session;

    public WahaApiService(
            @Value("${waha.base-url}") String baseUrl,
            @Value("${waha.api-key}") String apiKey,
            @Value("${waha.session}") String session) {
        this.session = session;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-Api-Key", apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @SuppressWarnings("unchecked")
    public String sendText(String chatId, String text) {
        Map<String, Object> body = Map.of(
                "session", session,
                "chatId", chatId,
                "text", text
        );
        Map<String, Object> response = (Map<String, Object>) webClient.post()
                .uri("/api/sendText")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        if (response == null) return null;
        Object id = response.get("id");
        return id != null ? id.toString() : null;
    }
}
