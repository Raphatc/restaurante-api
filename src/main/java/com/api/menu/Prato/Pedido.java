package com.api.menu.Prato;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "pedidos")
public class Pedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Positive
    private Integer mesa;

    // A anotação @OneToMany indica que um Pedido tem UMA lista de MUITOS itens.
    // "mappedBy" avisa ao Java que o "dono" do relacionamento é o campo "pedido" lá na outra classe.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens = new ArrayList<>();
    }