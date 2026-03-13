package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.domain.Agenda;
import com.moduloAi.TCC.dto.AgendaRequest;
import com.moduloAi.TCC.dto.AgendaResponse;
import com.moduloAi.TCC.service.AgendaService;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/getAgendaById")
    public Optional<Agenda> getAgendaById(@PathVariable long id){
        return agendaService.getAgendaById(id);
    }

    @PostMapping("/create")
    public Agenda create(@RequestBody AgendaRequest agendaRequest){
        return agendaService.create(agendaRequest);
    }

    @PutMapping("/update")
    public Agenda update(@RequestBody AgendaResponse agendaResponse){
        return agendaService.update(agendaResponse);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable long id){
        agendaService.delete(id);
    }
}
