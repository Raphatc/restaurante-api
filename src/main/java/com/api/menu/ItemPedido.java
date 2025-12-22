package com.api.menu;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    private Prato prato;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Prato pedido;


    private Integer quantidade;
    private String observacao;

}