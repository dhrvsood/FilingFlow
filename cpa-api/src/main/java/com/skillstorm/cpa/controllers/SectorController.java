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

import com.skillstorm.cpa.dtos.SectorDTO;
import com.skillstorm.cpa.models.Sector;
import com.skillstorm.cpa.services.SectorService;

@RestController
@RequestMapping("/sector")
public class SectorController {
	private SectorService service;
	
	public SectorController(SectorService service) {
		this.service = service;
	}
	
	// find all (find all by first name)
	@GetMapping
	public ResponseEntity<Iterable<Sector>> findAll(@RequestParam(name = "sector_name", required = false) String sectorName) {
		return service.findAll(sectorName);
	}
	
	// find by id
	@GetMapping("/{id}")
	public ResponseEntity<Sector> findById(@PathVariable int id) {
		return service.findById(id);
	}	
	
	// create one
	@PostMapping
	public ResponseEntity<Sector> createOne(@RequestBody SectorDTO dto) {
		return service.createOne(dto);
	}
	
	// update one
	@PutMapping("/{id}")
	public ResponseEntity<Sector> updateOne(@PathVariable int id, @RequestBody SectorDTO dto) {
		return service.updateOne(id, dto);
	}
	
	// delete one
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable int id) {
		return service.deleteById(id);
	}
}
