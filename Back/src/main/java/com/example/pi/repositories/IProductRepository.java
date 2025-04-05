package com.example.pi.repositories;
import com.example.pi.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
public interface IProductRepository extends JpaRepository<Product, Long> {
}
