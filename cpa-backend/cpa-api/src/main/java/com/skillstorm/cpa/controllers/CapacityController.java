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

import com.skillstorm.cpa.dtos.CapacityDTO;
import com.skillstorm.cpa.models.Capacity;
import com.skillstorm.cpa.services.CapacityService;

@RestController
@RequestMapping("/capacity")
public class CapacityController {
	private CapacityService service;
	
	public CapacityController(CapacityService service) {
		this.service = service;
	}
	
	// find all (find all by first name)
	@GetMapping
	public ResponseEntity<Iterable<Capacity>> findAll() {
		return service.findAll();
	}
	
	// find by id
//	@GetMapping("/{id}")
//	public ResponseEntity<Capacity> findById(@PathVariable int id) {
//		return service.findById(id);
//	}	
	
	// find by year
	@GetMapping("/{year}")
	public ResponseEntity<Capacity> findByYear(@PathVariable int year) {
		return service.findByYear(year);
	}
	
	// create one
	@PostMapping
	public ResponseEntity<Capacity> createOne(@RequestBody CapacityDTO dto) {
		return service.createOne(dto);
	}
	
	// update one
	@PutMapping("/{id}")
	public ResponseEntity<Capacity> updateOne(@PathVariable int id, @RequestBody CapacityDTO dto) {
		return service.updateOne(id, dto);
	}
	
	// delete one
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable int id) {
		return service.deleteById(id);
	}
}
