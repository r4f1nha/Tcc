package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.ServiceOrder;
import com.moduloAi.TCC.domain.ServiceOrderPriority;
import com.moduloAi.TCC.domain.ServiceOrderStatus;
import com.moduloAi.TCC.dto.ServiceOrderRequest;
import com.moduloAi.TCC.dto.ServiceOrderResponse;
import com.moduloAi.TCC.dto.UpdateServiceOrderStatusRequest;
import com.moduloAi.TCC.repository.ServiceOrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ServiceOrderService {

    private final ServiceOrderRepository serviceOrderRepository;

    public ServiceOrderService(ServiceOrderRepository serviceOrderRepository) {
        this.serviceOrderRepository = serviceOrderRepository;
    }

    public List<ServiceOrderResponse> list() {
        return serviceOrderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Map<String, List<ServiceOrderResponse>> getKanban() {
        List<ServiceOrderResponse> all = list();

        Map<String, List<ServiceOrderResponse>> kanban = new LinkedHashMap<>();
        kanban.put("ABERTA", all.stream().filter(x -> "ABERTA".equals(x.status())).toList());
        kanban.put("EM_ANALISE", all.stream().filter(x -> "EM_ANALISE".equals(x.status())).toList());
        kanban.put("AGUARDANDO_CLIENTE", all.stream().filter(x -> "AGUARDANDO_CLIENTE".equals(x.status())).toList());
        kanban.put("FINALIZADA", all.stream().filter(x -> "FINALIZADA".equals(x.status())).toList());

        return kanban;
    }

    public ServiceOrderResponse getById(Long id) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Service order not found: " + id));

        return toResponse(serviceOrder);
    }

    public ServiceOrderResponse create(ServiceOrderRequest request) {
        validateRequest(request);

        ServiceOrder serviceOrder = new ServiceOrder();
        serviceOrder.setCustomerName(request.customerName());
        serviceOrder.setCustomerPhone(request.customerPhone());
        serviceOrder.setVehicle(request.vehicle());
        serviceOrder.setPlate(request.plate());
        serviceOrder.setProblemDescription(request.problemDescription());
        serviceOrder.setStatus(parseStatus(request.status()));
        serviceOrder.setPriority(parsePriority(request.priority()));
        serviceOrder.setAssignedTo(request.assignedTo());
        serviceOrder.setNotes(request.notes());
        serviceOrder.setCreatedAt(LocalDateTime.now());
        serviceOrder.setUpdatedAt(LocalDateTime.now());

        ServiceOrder saved = serviceOrderRepository.save(serviceOrder);
        return toResponse(saved);
    }

    public ServiceOrderResponse update(Long id, ServiceOrderRequest request) {
        validateRequest(request);

        ServiceOrder serviceOrder = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Service order not found: " + id));

        serviceOrder.setCustomerName(request.customerName());
        serviceOrder.setCustomerPhone(request.customerPhone());
        serviceOrder.setVehicle(request.vehicle());
        serviceOrder.setPlate(request.plate());
        serviceOrder.setProblemDescription(request.problemDescription());
        serviceOrder.setStatus(parseStatus(request.status()));
        serviceOrder.setPriority(parsePriority(request.priority()));
        serviceOrder.setAssignedTo(request.assignedTo());
        serviceOrder.setNotes(request.notes());
        serviceOrder.setUpdatedAt(LocalDateTime.now());

        ServiceOrder updated = serviceOrderRepository.save(serviceOrder);
        return toResponse(updated);
    }

    public ServiceOrderResponse updateStatus(Long id, UpdateServiceOrderStatusRequest request) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Service order not found: " + id));

        serviceOrder.setStatus(parseStatus(request.status()));
        serviceOrder.setUpdatedAt(LocalDateTime.now());

        ServiceOrder updated = serviceOrderRepository.save(serviceOrder);
        return toResponse(updated);
    }

    public void delete(Long id) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Service order not found: " + id));

        serviceOrderRepository.delete(serviceOrder);
    }

    private void validateRequest(ServiceOrderRequest request) {
        if (request.customerName() == null || request.customerName().isBlank()) {
            throw new IllegalArgumentException("customerName is required");
        }

        if (request.problemDescription() == null || request.problemDescription().isBlank()) {
            throw new IllegalArgumentException("problemDescription is required");
        }

        if (request.status() == null || request.status().isBlank()) {
            throw new IllegalArgumentException("status is required");
        }

        if (request.priority() == null || request.priority().isBlank()) {
            throw new IllegalArgumentException("priority is required");
        }
    }

    private ServiceOrderStatus parseStatus(String value) {
        try {
            return ServiceOrderStatus.valueOf(value);
        } catch (Exception ex) {
            throw new IllegalArgumentException(
                    "invalid status. allowed: " + Arrays.toString(ServiceOrderStatus.values())
            );
        }
    }

    private ServiceOrderPriority parsePriority(String value) {
        try {
            return ServiceOrderPriority.valueOf(value);
        } catch (Exception ex) {
            throw new IllegalArgumentException(
                    "invalid priority. allowed: " + Arrays.toString(ServiceOrderPriority.values())
            );
        }
    }

    private ServiceOrderResponse toResponse(ServiceOrder serviceOrder) {
        return new ServiceOrderResponse(
                serviceOrder.getId(),
                serviceOrder.getCreatedAt(),
                serviceOrder.getUpdatedAt(),
                serviceOrder.getCustomerName(),
                serviceOrder.getCustomerPhone(),
                serviceOrder.getVehicle(),
                serviceOrder.getPlate(),
                serviceOrder.getProblemDescription(),
                serviceOrder.getStatus().name(),
                serviceOrder.getPriority().name(),
                serviceOrder.getAssignedTo(),
                serviceOrder.getNotes()
        );
    }
}