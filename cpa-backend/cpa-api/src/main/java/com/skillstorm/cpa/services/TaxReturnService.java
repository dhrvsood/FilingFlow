package com.skillstorm.cpa.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.cpa.dtos.TaxReturnDTO;
import com.skillstorm.cpa.exceptions.ExceededCapacityException;
import com.skillstorm.cpa.exceptions.InvalidTaxReturnException;
import com.skillstorm.cpa.models.Capacity;
import com.skillstorm.cpa.models.Client;
import com.skillstorm.cpa.models.Sector;
import com.skillstorm.cpa.models.TaxReturn;
import com.skillstorm.cpa.models.TaxReturn.FilingStatus;
import com.skillstorm.cpa.repositories.CapacityRepository;
import com.skillstorm.cpa.repositories.ClientRepository;
import com.skillstorm.cpa.repositories.SectorRepository;
import com.skillstorm.cpa.repositories.TaxReturnRepository;

@Service
public class TaxReturnService {
	
	@Autowired
	private TaxReturnRepository repo;
	
	@Autowired
	private CapacityRepository capacityRepo;
	
	@Autowired
	private ClientRepository clientRepo;
	
	@Autowired
	private SectorRepository sectorRepo;
	
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
		Optional<TaxReturn> taxReturn = repo.findById(id);
		
		if (taxReturn.isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		else
			return ResponseEntity.status(HttpStatus.OK).body(taxReturn.get());
	}
	
	// get count by year
	public int countByTaxYear(int year) {
		int taxReturnCount = repo.countByTaxYear(year);
		return taxReturnCount;	
	}
	
	// create one 
	public ResponseEntity<TaxReturn> createOne(TaxReturnDTO dto) {
		if (dto.clientId() == dto.spouseId())
			throw new InvalidTaxReturnException("Client ID cannot be same as Spouse ID");
		// 1. Check capacity for the given year
		Optional<Capacity> capacityOpt = capacityRepo.findByYear(dto.taxYear());
		if (!capacityOpt.isPresent())
			throw new RuntimeException("No capacity entry found for " + dto.taxYear());
		Capacity capacity = capacityOpt.get();
		
		// 2. Count existing tax returns for the year
		int currentTaxReturns = repo.countByTaxYear(dto.taxYear());
		
		// 3. Compare with max_num_returns in capacity table
		// if filing_status is married_separate, we need to check if there is enough room for 2 more returns
		// otherwise, we only need to check if there is enough room 1 more return
		int taxReturnsToAdd = dto.filingStatus() == FilingStatus.married_separate ? 2 : 1;
		if (currentTaxReturns + taxReturnsToAdd > capacity.getMaxNumReturns())
			throw new ExceededCapacityException("Exceeding capacity limit for year " + dto.taxYear());
		
		Client client = clientRepo.findById(dto.clientId()).get();
		Client spouse = null;
		if (dto.spouseId() != null)
			spouse = clientRepo.findById(dto.spouseId()).get();
		Sector sector = sectorRepo.findById(dto.sectorId()).get();
		
		TaxReturn tr = new TaxReturn(0, client, spouse, sector, dto.taxYear(), dto.filingStatus(), dto.taxLiability(), dto.taxPaid());
		
		try {
			return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(tr));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(null);
		}
	}
	
	// update one
	public ResponseEntity<TaxReturn> updateOne(int id, TaxReturnDTO dto) {
		if (dto.clientId() == dto.spouseId())
			throw new InvalidTaxReturnException("Client ID cannot be same as Spouse ID");
		
		Client client = clientRepo.findById(dto.clientId()).get();
		Client spouse = null;
		if (dto.spouseId() != null)
			spouse = clientRepo.findById(dto.spouseId()).get();
		Sector sector = sectorRepo.findById(dto.sectorId()).get();
		
		TaxReturn tr = new TaxReturn(id, client, spouse, sector, dto.taxYear(), dto.filingStatus(), dto.taxLiability(), dto.taxPaid());
		
		if (repo.existsById(id))
			return ResponseEntity.status(HttpStatus.OK).body(repo.save(tr));
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
