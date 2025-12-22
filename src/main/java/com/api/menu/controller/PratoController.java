package com.api.menu.controller;

import com.api.menu.Prato.Prato;
import com.api.menu.repository.PratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Prato")
public class PratoController {

    @Autowired
    private PratoRepository pratoRepository;

    @PostMapping
    public Prato salvarPrato(@RequestBody Prato prato) {
        return pratoRepository.save(prato);
    }

    @GetMapping
    public List<Prato> buscarPratos() {
        return pratoRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void excluirPrato(@PathVariable Long id) {
        pratoRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public void atualizarPrato(@PathVariable Long id, @RequestBody Prato prato) {
       Optional<Prato> optional = pratoRepository.findById(id);
       if (optional.isPresent()) {
           Prato pratoExistente = optional.get();
           pratoExistente.setPreco(prato.getPreco());
           pratoRepository.save(pratoExistente);
       }else {
           throw new ResponseStatusException(HttpStatus.NOT_FOUND);
       }
    }



}
