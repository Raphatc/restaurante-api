package com.api.menu.repository;

import com.api.menu.Prato.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query(value = "SELECT pedidos.* FROM pedidos " +
            "JOIN item_pedido ON pedidos.id = item_pedido.pedido_id " +
            "JOIN prato ON item_pedido.prato_id = prato.id " +
            "WHERE prato.nome LIKE %:pedido%", nativeQuery = true)
    List<Pedido> buscarPorPedido(@Param("pedido") String pedido);

}
