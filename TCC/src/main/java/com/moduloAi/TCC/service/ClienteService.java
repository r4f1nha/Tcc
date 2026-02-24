package com.moduloAi.TCC.service;

import com.moduloAi.TCC.dto.ClienteResponse;
import com.moduloAi.TCC.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    ClienteRepository clienteRepository;

    public List<ClienteResponse> list(){
        return clienteRepository.findAll().stream()
                .map(c -> new ClienteResponse(c.getId(),c.getNome(),c.getEmail(),c.getCpf(),c.getTelefone()))
                .toList();
    }
}
