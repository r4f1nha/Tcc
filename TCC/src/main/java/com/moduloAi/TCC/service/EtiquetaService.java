package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Etiqueta;
import com.moduloAi.TCC.dto.EtiquetaRequest;
import com.moduloAi.TCC.dto.EtiquetaResponse;
import com.moduloAi.TCC.repository.EtiquetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Service
public class EtiquetaService {

    private final EtiquetaRepository etiquetaRepository;

    public EtiquetaService(EtiquetaRepository etiquetaRepository){
        this.etiquetaRepository = etiquetaRepository;
    }

    public List<EtiquetaResponse> list(){
        return etiquetaRepository.findAll().stream()
                .map(e -> new EtiquetaResponse(e.getId(),e.getNome(), e.getDescricao(), e.getCor()))
                .toList();
    }

    public Optional<Etiqueta> getEtiquetaById(long id){
        return etiquetaRepository.findById(id);
    }

    public Etiqueta create(@RequestBody EtiquetaRequest etiquetaRequest){
        Etiqueta etiqueta = new Etiqueta(etiquetaRequest.nome(),
                etiquetaRequest.descricao(),
                etiquetaRequest.cor());

        return etiquetaRepository.save(etiqueta);
    }

    public Etiqueta update(EtiquetaResponse etiquetaResponse){
        Etiqueta etiqueta = etiquetaRepository.findById(etiquetaResponse.id())
                .orElseThrow(() -> new RuntimeException("Id não encontrado;" + etiquetaResponse.id()));
        etiqueta.setNome(etiquetaResponse.nome());
        etiqueta.setDescricao(etiquetaResponse.descricao());
        etiqueta.setCor(etiquetaResponse.cor());

        return etiquetaRepository.save(etiqueta);
    }

    public void delete(long id){
        etiquetaRepository.deleteById(id);
    }
}
