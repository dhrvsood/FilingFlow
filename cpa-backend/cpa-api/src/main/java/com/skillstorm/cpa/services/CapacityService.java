package com.skillstorm.cpa.services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.cpa.dtos.CapacityDTO;
import com.skillstorm.cpa.models.Capacity;
import com.skillstorm.cpa.repositories.CapacityRepository;

@Service
public class CapacityService {
	private CapacityRepository repo;
	
	public CapacityService(CapacityRepository repo) {
		this.repo = repo;
	}
	
	// find all
	public ResponseEntity<Iterable<Capacity>> findAll() {
		Iterable<Capacity> capacities = repo.findAll();
		
//		if (sectorName == null) {
//			sectors = repo.findAll();
//		} else {
//			sectors = repo.findAllByCapacityName(sectorName);
//		}
		
		if (!capacities.iterator().hasNext())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(capacities);
		else
			return ResponseEntity.status(HttpStatus.OK).body(capacities);
	}
	
	// find by id 
//	public ResponseEntity<Capacity> findById(int id) {
//		Optional<Capacity> capacity = repo.findById(id);
//		
//		if (capacity.isEmpty())
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//		else
//			return ResponseEntity.status(HttpStatus.OK).body(capacity.get());
//	}
	
	// find by year
	public ResponseEntity<Capacity> findByYear(int year) {
		Optional<Capacity> capacity = repo.findByYear(year);
		
		if (capacity.isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		else
			return ResponseEntity.status(HttpStatus.OK).body(capacity.get());
	}
	
	// create one 
	public ResponseEntity<Capacity> createOne(CapacityDTO dto) { 
		try {
			return ResponseEntity.status(HttpStatus.CREATED)
								 .body(repo.save(new Capacity(0, dto.taxYear(), dto.maxNumReturns())));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
		
	}
	
	// update one
	public ResponseEntity<Capacity> updateOne(int id, CapacityDTO dto) {
		if (repo.existsById(id))
			return ResponseEntity.status(HttpStatus.OK)
								.body(repo.save(new Capacity(id, dto.taxYear(), dto.maxNumReturns())));
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
