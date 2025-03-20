package com.skillstorm.cpa.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.cpa.models.Capacity;

@Repository
public interface CapacityRepository extends CrudRepository<Capacity, Integer> {
	@Query(value = "SELECT * FROM capacity WHERE year = ?1", nativeQuery = true)
	public Optional<Capacity> findByYear(int taxYear);
}
