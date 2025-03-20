package com.skillstorm.cpa.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.cpa.dtos.TaxReturnDTO;
import com.skillstorm.cpa.models.Capacity;
import com.skillstorm.cpa.models.TaxReturn;
import com.skillstorm.cpa.models.TaxReturn.FilingStatus;
import com.skillstorm.cpa.repositories.CapacityRepository;
import com.skillstorm.cpa.repositories.TaxReturnRepository;

@Service
public class TaxReturnService {
	
	@Autowired
	private TaxReturnRepository repo;
	
	@Autowired
	private CapacityRepository capacityRepo;
	
	
	public TaxReturnService(TaxReturnRepository repo) {
		this.repo = repo;
	}
	
	// find all
	public ResponseEntity<Iterable<TaxReturn>> findAll() {
		Iterable<TaxReturn> taxReturns = repo.findAll();
		if (!taxReturns.iterator().hasNext())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(taxReturns);
		else
			return ResponseEntity.status(HttpStatus.OK).body(taxReturns);
			
	}
	
	// find by id 
	public ResponseEntity<TaxReturn> findById(int id) {
		Optional<TaxReturn> client = repo.findById(id);
		
		if (client.isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		else
			return ResponseEntity.status(HttpStatus.OK).body(client.get());
	}
	
	// create one 
	public ResponseEntity<TaxReturn> createOne(TaxReturnDTO dto) { 
		// 1. Check capacity for the given year
		Optional<Capacity> capacityOpt = capacityRepo.findByYear(dto.taxYear());
		if (!capacityOpt.isPresent())
			throw new RuntimeException("No capacity entry foud for " + dto.taxYear());
		Capacity capacity = capacityOpt.get();
		
		// 2. Count existing tax returns for the year
		int currentTaxReturns = repo.countByTaxYear(dto.taxYear());
		
		// 3. Compare with max_num_returns in capacity table
		// if filing_status is married_separate, we need to check if there is enough room for 2 more returns
		// otherwise, we only need to check if there is enough room 1 more return
		int taxReturnsToAdd = dto.filingStatus() == FilingStatus.married_separate ? 2 : 1;
		if (currentTaxReturns + taxReturnsToAdd > capacity.getMaxNumReturns())
			throw new RuntimeException("Exceeding capacity limit for year " + dto.taxYear() + ": ");

		try {
			return ResponseEntity.status(HttpStatus.CREATED)
								 .body(repo.save(new TaxReturn(0, dto.client(), dto.spouse(), dto.sector(), dto.taxYear(), dto.filingStatus(), dto.taxLiability(), dto.taxPaid())));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}
	
	// update one
	public ResponseEntity<TaxReturn> updateOne(int id, TaxReturnDTO dto) {
		if (repo.existsById(id))
			return ResponseEntity.status(HttpStatus.OK)
					 			 .body(new TaxReturn(id, dto.client(), dto.spouse(), dto.sector(), dto.taxYear(), dto.filingStatus(), dto.taxLiability(), dto.taxPaid()));
		else
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(null);
	}
	
	
	// delete by id
	public ResponseEntity<Void> deleteById(int id) {
		try {
			repo.deleteById(id); 
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); 
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}
	
	
}
