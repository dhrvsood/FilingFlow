package com.skillstorm.cpa.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "capacity")
public class Capacity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "capacity_id")
	private int id;
	
	@Column(name = "tax_year")
	private int taxYear;
	
	@Column(name = "max_num_returns")
	private int maxNumReturns;
}
