package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.dto.ServiceOrderRequest;
import com.moduloAi.TCC.dto.ServiceOrderResponse;
import com.moduloAi.TCC.dto.UpdateServiceOrderStatusRequest;
import com.moduloAi.TCC.service.ServiceOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/service-orders")
public class ServiceOrdersController {

    ServiceOrderService orderService;
    public ServiceOrdersController(ServiceOrderService orderService){
        this.orderService = orderService;
    }

    @GetMapping
    public List<ServiceOrderResponse> list() {
        return orderService.list();
    }

    @GetMapping("/kanban")
    public Map<String, List<ServiceOrderResponse>> getKanban() {
        return orderService.getKanban();
    }

    @GetMapping("/{id}")
    public ServiceOrderResponse getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceOrderResponse create(@RequestBody ServiceOrderRequest request) {
        return orderService.create(request);
    }

    @PutMapping("/{id}")
    public ServiceOrderResponse update(
            @PathVariable Long id,
            @RequestBody ServiceOrderRequest request
    ) {
        return orderService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public ServiceOrderResponse updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateServiceOrderStatusRequest request
    ) {
        return orderService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        orderService.delete(id);
    }
}
