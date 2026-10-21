package com.greenharvest.repository;

import com.greenharvest.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    /** Shop search: active products whose name contains the text. Empty text matches everything. */
    @Query("select p from Product p join fetch p.category c "
            + "where p.active = true and lower(p.name) like lower(concat('%', :q, '%')) "
            + "order by p.name")
    List<Product> searchActive(@Param("q") String q);

    @Query("select p from Product p join fetch p.category c "
            + "where p.active = true and c.id = :categoryId "
            + "and lower(p.name) like lower(concat('%', :q, '%')) "
            + "order by p.name")
    List<Product> searchActiveByCategory(@Param("categoryId") Long categoryId, @Param("q") String q);

    /** Admin list: everything, newest first. */
    @Query("select p from Product p join fetch p.category order by p.id desc")
    List<Product> findAllWithCategory();

    /** Locks the row while an order is being placed so two buyers cannot take the same stock. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

    boolean existsByCategoryId(Long categoryId);

    long countByActiveTrue();

    long countByActiveTrueAndStockQuantityLessThan(int quantity);
}
