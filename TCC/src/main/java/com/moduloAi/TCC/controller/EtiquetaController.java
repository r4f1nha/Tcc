package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.domain.Etiqueta;
import com.moduloAi.TCC.dto.EtiquetaRequest;
import com.moduloAi.TCC.dto.EtiquetaResponse;
import com.moduloAi.TCC.service.EtiquetaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/etiqueta")
public class EtiquetaController {

   private final EtiquetaService etiquetaService;

   public EtiquetaController(EtiquetaService etiquetaService){
       this.etiquetaService = etiquetaService;
   }

   @GetMapping("/getAllEtiquetas")
    public List<Etiqueta> list(){
       return etiquetaService.list();
   }

   @GetMapping("getEtiquetaById")
    public Optional<Etiqueta> getEtiquetaById(@PathVariable long id){
       return etiquetaService.getEtiquetaById(id);
   }

   @PostMapping("/create")
    public Etiqueta create(@RequestBody EtiquetaRequest etiquetaRequest){
        return etiquetaService.create(etiquetaRequest);
   }

   @PutMapping("/update")
    public Etiqueta update(@RequestBody EtiquetaResponse etiquetaResponse){
      return etiquetaService.update(etiquetaResponse);
   }

   @DeleteMapping("/delete")
    public void delete(@PathVariable long id){
       etiquetaService.delete(id);
   }
}
