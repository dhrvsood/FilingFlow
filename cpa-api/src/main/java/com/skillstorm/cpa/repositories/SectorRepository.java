package com.skillstorm.cpa.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.cpa.models.Sector;

@Repository
public interface SectorRepository extends CrudRepository<Sector, Integer> {
	
	@Query(value = "SELECT * FROM sector WHERE sector_name = ?1", nativeQuery = true)
	public Iterable<Sector> findAllBySectorName(String sectorName);
}
