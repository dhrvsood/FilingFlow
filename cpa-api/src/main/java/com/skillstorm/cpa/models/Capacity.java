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
	
	@Column(name = "year")
	private int taxYear;
	
	@Column(name = "max_num_returns")
	private int maxNumReturns;
	
	public Capacity() {
		super();
	}

	public Capacity(int id, int taxYear, int maxNumReturns) {
		super();
		this.id = id;
		this.taxYear = taxYear;
		this.maxNumReturns = maxNumReturns;
	}

	public int getId() {
		return id;
	}

	public int getTaxYear() {
		return taxYear;
	}

	public int getMaxNumReturns() {
		return maxNumReturns;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setTaxYear(int taxYear) {
		this.taxYear = taxYear;
	}

	public void setMaxNumReturns(int maxNumReturns) {
		this.maxNumReturns = maxNumReturns;
	}

	@Override
	public String toString() {
		return "Capacity [id=" + id + ", taxYear=" + taxYear + ", maxNumReturns=" + maxNumReturns + "]";
	}
}
