package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Cliente;
import com.moduloAi.TCC.dto.ClienteRequest;
import com.moduloAi.TCC.dto.ClienteResponse;
import com.moduloAi.TCC.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ClienteResponse> list(){
        return clienteRepository.findAll().stream()
                .map(c -> new ClienteResponse(c.getId(),c.getNome(),c.getEmail(),c.getCpf(),c.getTelefone()))
                .toList();
    }

    public Cliente create(@RequestBody ClienteRequest request){
        Cliente cliente = new Cliente(
                request.nome(),
                request.email(),
                request.cpf(),
                request.telefone());
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> getClienteById(long id){
        return clienteRepository.findById(id);
    }

    public Cliente update(@RequestBody ClienteResponse clienteResponse){
         Cliente cliente =  clienteRepository.findById(clienteResponse.id())
                 .orElseThrow(() -> new RuntimeException("Id nao encontrado" + clienteResponse.id()));

         cliente.setNome(clienteResponse.nome());
         cliente.setEmail(clienteResponse.email());
         cliente.setCpf(clienteResponse.cpf());
         cliente.setTelefone(clienteResponse.telefone());

         return clienteRepository.save(cliente);
    }

    public void delete(@PathVariable long id){
        clienteRepository.deleteById(id);
    }
}
