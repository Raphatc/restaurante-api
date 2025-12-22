package com.api.menu.Prato;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A anotação @OneToMany indica que um Pedido tem UMA lista de MUITOS itens.
    // "mappedBy" avisa ao Java que o "dono" do relacionamento é o campo "pedido" lá na outra classe.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens = new ArrayList<>();
    }