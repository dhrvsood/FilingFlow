package com.skillstorm.cpa.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.cpa.dtos.ClientDTO;
import com.skillstorm.cpa.models.Client;
import com.skillstorm.cpa.models.TaxReturn;
import com.skillstorm.cpa.models.TaxReturn.FilingStatus;
import com.skillstorm.cpa.repositories.ClientRepository;
import com.skillstorm.cpa.repositories.TaxReturnRepository;

@Service
public class ClientService {
	@Autowired
	private ClientRepository repo;
	
	@Autowired
	private TaxReturnRepository taxReturnRepo;
	
	public ClientService(ClientRepository repo) {
		this.repo = repo;
	}
	
	// find all
	public ResponseEntity<Iterable<Client>> findAll(String firstName) {
		Iterable<Client> clients;
		
		if (firstName == null) {
			clients = repo.findAll();
		} else {
			clients = repo.findAllByFirstName(firstName);
		}
		
		// Iterate through all clients 
		for (Client client : clients) {
			for (TaxReturn taxReturn : client.getTaxReturns()) {
				// Check if filing status if married_joint and there is a spouse
				if (taxReturn.getFilingStatus() == FilingStatus.married_joint && taxReturn.getSpouse() != null) {
					Client spouse = taxReturn.getSpouse();
					
					// Ensure spouse's taxReturns list contains the same tax return
					if (!spouse.getTaxReturns().contains(taxReturn)) {
						spouse.getTaxReturns().add(taxReturn);
					}
				}
			}
		}
		
		if (!clients.iterator().hasNext())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(clients);
		else
			return ResponseEntity.status(HttpStatus.OK).body(clients);
			
	}
	
	// find by id 
	public ResponseEntity<Client> findById(int id) {
		Optional<Client> client = repo.findById(id);
		
		if (client.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		} else {
			Client foundClient = client.get();			
			Iterable<TaxReturn> spouseTaxReturns = taxReturnRepo.findAllBySpouseID(id);
			
			for (TaxReturn taxReturn : spouseTaxReturns) {
				// only add it back in if the spouse is married_joint
				if (taxReturn.getFilingStatus() == FilingStatus.married_joint && !foundClient.getTaxReturns().contains(taxReturn)) {
					foundClient.getTaxReturns().add(taxReturn);
				}
			}
			
			return ResponseEntity.status(HttpStatus.OK).body(foundClient);
		}
	}
	
	// Method to get clients who haven't filed a return for the selected year
	public ResponseEntity<Iterable<Client>> findClientsWithoutReturnForYear(int taxYear) {
		Iterable<Client> clients = repo.findClientsWithoutReturnForYear(taxYear);
		return ResponseEntity.status(HttpStatus.OK).body(clients);
	}
	
	// create one 
	public ResponseEntity<Client> createOne(ClientDTO dto) { 
		try {
			return ResponseEntity.status(HttpStatus.CREATED)
								 .body(repo.save(new Client(0, dto.firstName(), dto.lastName(), dto.email(), dto.address(), [])));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
		
	}
	
	// update one
	public ResponseEntity<Client> updateOne(int id, ClientDTO dto) {
		if (repo.existsById(id))
			return ResponseEntity.status(HttpStatus.OK)
					 			 .body(repo.save(new Client(id, dto.firstName(), dto.lastName(), dto.email(), dto.address(), dto.taxReturns())));
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
