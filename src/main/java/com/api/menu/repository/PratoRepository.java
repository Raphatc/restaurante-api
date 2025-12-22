package com.api.menu.repository;

import com.api.menu.Prato.Prato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PratoRepository extends JpaRepository<Prato, Long> {

    @Query(value = "SELECT * FROM prato WHERE nome LIKE %:nome%", nativeQuery = true)
    List<Prato> buscarPorNome(@Param("nome") String nome);


    @Query(value = "SELECT * FROM prato WHERE preco <= :precoMaximo", nativeQuery = true)
    List<Prato> buscarPratosBaratos(@Param("precoMaximo") BigDecimal preco);

    @Query(value = "SELECT * FROM prato WHERE descricao LIKE CONCAT('%', :termo, '%')", nativeQuery = true)
    List<Prato> buscarPorDescricao(@Param("termo")String descricao);
}

