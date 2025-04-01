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
	
	@Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN COUNT(*) ELSE 0 END FROM tax_return WHERE tax_year = ?1", nativeQuery = true)
	public int countByTaxYear(int taxYear);
	

    @Query(value = "SELECT COUNT(*) " +
            "FROM cpa.tax_return tr " +
            "WHERE tr.tax_year = ?1 AND " +
            "(tr.client_id = ?2 OR tr.spouse_id = ?2 OR " +
            "(tr.client_id = ?3 OR tr.spouse_id = ?3) OR " +
            "(?3 IS NULL AND (tr.client_id = ?2 OR tr.spouse_id = ?2)))", 
    nativeQuery = true)
	public int existsByTaxYearAndClientOrSpouse(int taxYear, int clientId, Integer spouseId);
	
	
}
