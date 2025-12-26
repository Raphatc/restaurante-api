package com.api.menu.config;

import com.api.menu.Prato.ItemPedido;
import com.api.menu.Prato.Pedido;
import com.api.menu.Prato.Prato;
import com.api.menu.repository.PedidoRepository;
import com.api.menu.repository.PratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


import java.math.BigDecimal;

@Component // Importante: Diz ao Spring para gerir esta classe
public class DataLoader implements CommandLineRunner {

    @Autowired
    private PratoRepository pratoRepository;
    @Autowired
    private PedidoRepository pedidoRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- A carregar dados iniciais... ---");
        Prato pt = new Prato();
        pt.setNome("Pizza de Queijo");
        pt.setPreco(new BigDecimal(15.00));
        pratoRepository.save(pt);
        System.out.println("--- Prato salvo com sucesso! ---");
        Pedido pd = new Pedido();
        ItemPedido item = new ItemPedido();
        item.setPrato(pt);
        item.setPedido(pd);
        item.setQuantidade(2);
        pd.getItens().add(item);
        pedidoRepository.save(pd);

        System.out.println("--- Pedido salvo com sucesso! ---");
    }
}