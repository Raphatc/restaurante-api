package com.api.menu.controller;

import com.api.menu.Prato.Pedido;
import com.api.menu.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService; // O Controller fala com o Service, não com o Repository!

    // 1. FAZER UM NOVO PEDIDO
    // O cliente envia os dados e nós passamos para o Service cadastrar
    @PostMapping
    public Pedido criarPedido(@RequestBody Pedido pedido) {
        return pedidoService.cadastrarPedido(pedido);
    }

    // 2. LISTAR TODOS OS PEDIDOS
    // Para vermos o histórico de tudo o que foi pedido
    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.listarTodos();
    }

    // 3. BUSCAR PEDIDOS QUE CONTÊM UM PRATO ESPECÍFICO
    // Exemplo de uso no navegador/Postman: /pedidos/busca?nome=Pizza
    @GetMapping("/busca")
    public List<Pedido> buscarPorItem(@RequestParam String nome) {
        return pedidoService.buscarPorNomeDoItem(nome);
    }
}