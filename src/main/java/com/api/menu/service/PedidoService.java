package com.api.menu.service;


import com.api.menu.Prato.ItemPedido;
import com.api.menu.Prato.Pedido;
import com.api.menu.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;


    public Pedido cadastrarPedido(Pedido pedido) {
        for (ItemPedido item : pedido.getItens()) {
            item.setPedido(pedido);
        }

        return pedidoRepository.save(pedido);
    }


        public List<Pedido> buscarPorNomeDoItem(String nomeItem) {
        return pedidoRepository.buscarPorPedido(nomeItem);
    }


        public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }
}
