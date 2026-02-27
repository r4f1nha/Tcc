package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Agenda;
import com.moduloAi.TCC.dto.AgendaResponse;
import com.moduloAi.TCC.repository.AgendaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

public class AgendaService {

    private final AgendaRepository agendaRepository;

    public AgendaService(AgendaRepository agendaRepository){
        this.agendaRepository = agendaRepository;
    }

    @GetMapping("/getAllAgenda")
    public List<AgendaResponse> list(){
        return agendaRepository.findAll().stream()
                .map(a -> new AgendaResponse(a.getId(), a.getCliente().getId(), a.getTitulo(), a.getDescricao(),
                        a.getCnpj(), a.getStartAt(), a.getEndAt())).toList();
    }

    @GetMapping("/getAgendaById")
    public Optional<Agenda> getAgendaById(@PathVariable long id){
        return agendaRepository.findById(id);
    }
}
