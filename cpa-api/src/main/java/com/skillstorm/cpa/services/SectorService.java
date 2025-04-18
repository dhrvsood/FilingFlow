package com.skillstorm.cpa.services;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.cpa.dtos.SectorDTO;
import com.skillstorm.cpa.models.Sector;
import com.skillstorm.cpa.models.TaxReturn;
import com.skillstorm.cpa.repositories.SectorRepository;

@Service
public class SectorService {
	private SectorRepository repo;
	
	public SectorService(SectorRepository repo) {
		this.repo = repo;
	}
	
	// find all
	public ResponseEntity<Iterable<Sector>> findAll(String sectorName) {
		Iterable<Sector> sectors;
		
		if (sectorName == null) {
			sectors = repo.findAll();
		} else {
			sectors = repo.findAllBySectorName(sectorName);
		}
		
		if (!sectors.iterator().hasNext())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(sectors);
		else
			return ResponseEntity.status(HttpStatus.OK).body(sectors);
			
	}
	
	// find by id 
	public ResponseEntity<Sector> findById(int id) {
		Optional<Sector> sector = repo.findById(id);
		
		if (sector.isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		else
			return ResponseEntity.status(HttpStatus.OK).body(sector.get());
	}
	
	// create one 
	public ResponseEntity<Sector> createOne(SectorDTO dto) { 
		List<TaxReturn> trs = new LinkedList<>();
		try {
			return ResponseEntity.status(HttpStatus.CREATED)
								 .body(repo.save(new Sector(0, dto.sectorName(), trs)));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
		
	}
	
	// update one
	public ResponseEntity<Sector> updateOne(int id, SectorDTO dto) {
		if (repo.existsById(id))
			return ResponseEntity.status(HttpStatus.OK)
					 			 .body(repo.save(new Sector(id, dto.sectorName(), dto.taxReturns())));
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
