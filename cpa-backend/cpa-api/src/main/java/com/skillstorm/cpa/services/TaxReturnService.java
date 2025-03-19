package com.skillstorm.cpa.services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.cpa.dtos.TaxReturnDTO;
import com.skillstorm.cpa.models.TaxReturn;
import com.skillstorm.cpa.repositories.TaxReturnRepository;

@Service
public class TaxReturnService {
	private TaxReturnRepository repo;
	
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
