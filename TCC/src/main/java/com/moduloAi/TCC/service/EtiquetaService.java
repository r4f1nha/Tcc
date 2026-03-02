package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Etiqueta;
import com.moduloAi.TCC.dto.EtiquetaRequest;
import com.moduloAi.TCC.dto.EtiquetaResponse;
import com.moduloAi.TCC.repository.EtiquetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;
import java.util.Optional;

@Service
public class EtiquetaService {

    private final EtiquetaRepository etiquetaRepository;

    public EtiquetaService(EtiquetaRepository etiquetaRepository){
        this.etiquetaRepository = etiquetaRepository;
    }

    @GetMapping("/getAllEtiquetas")
    public List<Etiqueta> list(){
        return etiquetaRepository.findAll().stream()
                .map(e -> new Etiqueta(e.getNome(), e.getDescricao(), e.getCor()))
                .toList();
    }

    @GetMapping("/getEtiquetaById")
    public Optional<Etiqueta> getEtiquetaById(long id){
        return etiquetaRepository.findById(id);
    }

    @PostMapping("/create")
    public Etiqueta create(EtiquetaRequest etiquetaRequest){
        Etiqueta etiqueta = new Etiqueta(etiquetaRequest.nome(),
                etiquetaRequest.descricao(),
                etiquetaRequest.cor());

        return etiquetaRepository.save(etiqueta);
    }
    @PutMapping("/update")
    public Etiqueta update(EtiquetaResponse etiquetaResponse){
        Etiqueta etiqueta = etiquetaRepository.findById(etiquetaResponse.id())
                .orElseThrow(() -> new RuntimeException("Id não encontrado;" + etiquetaResponse.id()));
        etiqueta.setNome(etiquetaResponse.nome());
        etiqueta.setDescricao(etiquetaResponse.descricao());
        etiqueta.setCor(etiquetaResponse.cor());

        return etiquetaRepository.save(etiqueta);
    }

    @DeleteMapping("/delete")
    public void delete(long id){
        etiquetaRepository.deleteById(id);
    }
}
