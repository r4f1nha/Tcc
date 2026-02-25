package com.moduloAi.TCC.domain;

import com.moduloAi.TCC.service.ClienteService;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "cpf", nullable = false, length = 11)
    private String cpf;

    @Column(name = "telefone", nullable = false, length = 15)
    private String telefone;

    public Cliente(){

    }

    public Cliente(String nome, String email, String cpf, String telefone){
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
    }
}
