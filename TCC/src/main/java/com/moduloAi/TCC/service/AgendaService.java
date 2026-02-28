package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Agenda;
import com.moduloAi.TCC.domain.Cliente;
import com.moduloAi.TCC.dto.AgendaRequest;
import com.moduloAi.TCC.dto.AgendaResponse;
import com.moduloAi.TCC.repository.AgendaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class AgendaService {

    private final AgendaRepository agendaRepository;
    private final ClienteService clienteService;


    public AgendaService(AgendaRepository agendaRepository, ClienteService clienteService){
        this.agendaRepository = agendaRepository;
        this.clienteService = clienteService;
    }

    @GetMapping("/getAllAgenda")
    public List<AgendaResponse> list(){
        return agendaRepository.findAll().stream()
                .map(a -> new AgendaResponse(a.getId(), a.getCliente().getId(), a.getTitulo(), a.getDescricao(),
                        a.getStartAt(), a.getEndAt())).toList();
    }

    @GetMapping("/getAgendaById")
    public Optional<Agenda> getAgendaById(@PathVariable long id){
        return agendaRepository.findById(id);
    }

    @PostMapping("/create")
    public Agenda create(AgendaRequest agendaRequest) {

        Cliente cliente = clienteService.getClienteById(agendaRequest.clienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente não encontrado: " + agendaRequest.clienteId()
                ));

        Agenda agenda = new Agenda(cliente, agendaRequest.titulo(), agendaRequest.descricao(), agendaRequest.startAt(), agendaRequest.endAt());
        return agendaRepository.save(agenda);
    }

    @PutMapping("/update")
    public Agenda update(AgendaResponse agendaResponse){
        Cliente cliente = clienteService.getClienteById(agendaResponse.clienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente não encontrado: " + agendaResponse.clienteId()
                ));

        if(cliente.getId() != agendaResponse.clienteId()){
            cliente.setId(agendaResponse.Id());
        }

        Agenda agenda = agendaRepository.findById(agendaResponse.Id())
                .orElseThrow(() -> new RuntimeException("Id da agenda não encontrado" + agendaResponse.Id()));

        agenda.setTitulo(agendaResponse.titulo());
        agenda.setDescricao(agendaResponse.descricao());
        agenda.setStartAt(agendaResponse.startAt());
        agenda.setEndAt(agendaResponse.endAt());

        return agendaRepository.save(agenda);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(long id){
        agendaRepository.deleteById(id);
    }
}
