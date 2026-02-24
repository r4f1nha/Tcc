package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.dto.ClienteResponse;
import com.moduloAi.TCC.service.ClienteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService){
        this.clienteService = clienteService;
    }

    @GetMapping("/getAllClients")
    public List<ClienteResponse> list(){
        return clienteService.list();
    }
}
