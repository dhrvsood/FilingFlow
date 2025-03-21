package com.skillstorm.cpa.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.cpa.models.Client;

@Repository
public interface ClientRepository extends CrudRepository<Client, Integer> {
	
	@Query(value = "SELECT * FROM client WHERE first_name = ?1", nativeQuery = true)
	public Iterable<Client> findAllByFirstName(String firstName);
	
	@Query(value = "SELECT * FROM client c WHERE c.client_id NOT IN " +
            "(SELECT r.client_id FROM tax_return r WHERE r.tax_year = ?1)", 
    nativeQuery = true)
	public Iterable<Client> findClientsWithoutReturnForYear(int taxYear);
}
