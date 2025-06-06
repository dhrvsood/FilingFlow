package com.skillstorm.cpa.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.cpa.dtos.ClientDTO;
import com.skillstorm.cpa.models.Client;
import com.skillstorm.cpa.services.ClientService;

@RestController
@RequestMapping("/client")
public class ClientController {
	private ClientService service;
	
	public ClientController(ClientService service) {
		this.service = service;
	}
	
	// find all (find all by first name)
	@GetMapping
	public ResponseEntity<Iterable<Client>> findAll(@RequestParam(name = "first_name", required = false) String firstName) {
		return service.findAll(firstName);
	}
	
	// find by id
	@GetMapping("/{id}")
	public ResponseEntity<Client> findById(@PathVariable int id) {
		return service.findById(id);
	}
	
	@GetMapping("/year/{taxYear}")
	public ResponseEntity<Iterable<Client>> findClientsWithoutReturnForYear(@PathVariable int taxYear) {
		return service.findClientsWithoutReturnForYear(taxYear);
	}
	
	// create one
	@PostMapping
	public ResponseEntity<Client> createOne(@RequestBody ClientDTO dto) {
		return service.createOne(dto);
	}
	
	// update one
	@PutMapping("/{id}")
	public ResponseEntity<Client> updateOne(@PathVariable int id, @RequestBody ClientDTO dto) {
		return service.updateOne(id, dto);
	}
	
	// delete one
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable int id) {
		return service.deleteById(id);
	}
}
