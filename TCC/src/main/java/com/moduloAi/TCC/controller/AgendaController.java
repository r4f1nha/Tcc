package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.domain.Agenda;
import com.moduloAi.TCC.dto.AgendaResponse;
import com.moduloAi.TCC.service.AgendaService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/agenda")
public class AgendaController {

    private final AgendaService agendaService;

    public AgendaController(AgendaService agendaService){
        this.agendaService = agendaService;
    }

    @GetMapping("/getAllAgenda")
    public List<AgendaResponse> list(){
        return agendaService.list();
    }

    public Optional<Agenda> getAgendaById(@PathVariable long id){
        return agendaService.getAgendaById(id);
    }
}
