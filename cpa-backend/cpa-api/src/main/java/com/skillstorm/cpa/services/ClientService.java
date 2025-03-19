package com.skillstorm.cpa.services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.cpa.dtos.ClientDTO;
import com.skillstorm.cpa.models.Client;
import com.skillstorm.cpa.repositories.ClientRepository;

@Service
public class ClientService {
	private ClientRepository repo;
	
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
		
		if (!clients.iterator().hasNext())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(clients);
		else
			return ResponseEntity.status(HttpStatus.OK).body(clients);
			
	}
	
	// find by id 
	public ResponseEntity<Client> findById(int id) {
		Optional<Client> client = repo.findById(id);
		
		if (client.isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		else
			return ResponseEntity.status(HttpStatus.OK).body(client.get());
	}
	
	// create one 
	public ResponseEntity<Client> createOne(ClientDTO dto) { 
		try {
			return ResponseEntity.status(HttpStatus.CREATED)
								 .body(repo.save(new Client(0, dto.firstName(), dto.lastName(), dto.email(), dto.address(), dto.taxReturns())));
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
