package com.skillstorm.cpa.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "sector")
public class Sector {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sector_id")
	private int id;
	
	@Column(name = "sector_name")
	private String sectorName;
	
	@OneToMany(mappedBy = "sector")
//	@JsonIgnoreProperties("client")
	private List<TaxReturn> taxReturns;

	public Sector() {
		super();
	}

	public Sector(int id, String sectorName, List<TaxReturn> taxReturns) {
		super();
		this.id = id;
		this.sectorName = sectorName;
		this.taxReturns = taxReturns;
	}
	
	public int getId() {
		return id;
	}

	public String getSectorName() {
		return sectorName;
	}

	public List<TaxReturn> getTaxReturns() {
		return taxReturns;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setSectorName(String sectorName) {
		this.sectorName = sectorName;
	}

	public void setTaxReturns(List<TaxReturn> taxReturns) {
		this.taxReturns = taxReturns;
	}

	@Override
	public String toString() {
		return "Sector [id=" + id + ", sectorName=" + sectorName + ", taxReturns=" + taxReturns + "]";
	}
}
