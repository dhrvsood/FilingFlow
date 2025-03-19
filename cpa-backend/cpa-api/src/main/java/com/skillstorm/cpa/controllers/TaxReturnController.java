package com.skillstorm.cpa.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.cpa.dtos.TaxReturnDTO;
import com.skillstorm.cpa.models.TaxReturn;
import com.skillstorm.cpa.services.TaxReturnService;

@RestController
@RequestMapping("/return")
public class TaxReturnController {
	private TaxReturnService service;
	
	public TaxReturnController(TaxReturnService service) {
		this.service = service;
	}
	
	// find all (find all by first name)
	@GetMapping
	public ResponseEntity<Iterable<TaxReturn>> findAll() {
		return service.findAll();
	}
	
	// find by id
	@GetMapping("/{id}")
	public ResponseEntity<TaxReturn> findById(@PathVariable int id) {
		return service.findById(id);
	}	
	
	// create one
	@PostMapping
	public ResponseEntity<TaxReturn> createOne(@RequestBody TaxReturnDTO dto) {
		return service.createOne(dto);
	}
	
	// update one
	@PutMapping("/{id}")
	public ResponseEntity<TaxReturn> updateOne(@PathVariable int id, @RequestBody TaxReturnDTO dto) {
		return service.updateOne(id, dto);
	}
	
	// delete one
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable int id) {
		return service.deleteById(id);
	}
}
