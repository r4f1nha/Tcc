package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.domain.Cliente;
import com.moduloAi.TCC.dto.ClienteRequest;
import com.moduloAi.TCC.dto.ClienteResponse;
import com.moduloAi.TCC.service.ClienteService;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/create")
    public Cliente create(@RequestBody ClienteRequest request){
        return clienteService.create(request);
    }

    @PutMapping("/update")
    public Cliente update(@RequestBody ClienteResponse clienteResponse){
       return clienteService.update(clienteResponse);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable long id){
        clienteService.delete(id);
    }
}
