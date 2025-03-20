package com.skillstorm.cpa.repositories;

import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.cpa.models.TaxReturn;
import com.skillstorm.cpa.models.TaxReturn.FilingStatus;

@Repository
public interface TaxReturnRepository extends CrudRepository<TaxReturn, Integer> {
	@Query(value = "SELECT * FROM tax_return WHERE client_id = ?1 OR spouse_id = ?1", nativeQuery = true)
	public Iterable<TaxReturn> findByClientId(int clientId);
	
	@Query(value = "SELECT * FROM tax_return WHERE tax_year = ?1", nativeQuery = true)
	public Iterable<TaxReturn> findByTaxYear(int taxYear);
	
	@Query(value = "SELECT * FROM tax_return t WHERE t.spouse_id = ?1", nativeQuery = true)
	public Iterable<TaxReturn> findAllBySpouseID(int spouseId);
	
	@Query(value = "SELECT * FROM tax_return WHERE filing_status = ?1", nativeQuery = true)
	public Iterable<TaxReturn> findByFilingStatus(FilingStatus filingStatus);
	
	@Query(value = "SELECT COUNT(*) FROM tax_return WHERE tax_year = ?1", nativeQuery = true)
	public int countByTaxYear(int taxYear);
}
