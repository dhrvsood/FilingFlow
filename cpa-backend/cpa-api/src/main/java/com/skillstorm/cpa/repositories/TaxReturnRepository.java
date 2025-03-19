package com.skillstorm.cpa.repositories;

//import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.cpa.models.TaxReturn;

@Repository
public interface TaxReturnRepository extends CrudRepository<TaxReturn, Integer> {
	
//	@Query(value = "SELECT * FROM client WHERE first_name = ?1", nativeQuery = true)
//	public Iterable<Client> findAllByFirstName(String firstName);
}
