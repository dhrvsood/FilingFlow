package com.skillstorm.cpa.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tax_return")
public class TaxReturn {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tax_return_id")
	private int id;
	
	@ManyToOne
	private Client client;
	
	@ManyToOne
	private Client spouse;
	
	@ManyToOne
	private Sector sector;
	
	@Column(name = "tax_year")
	private int taxYear;
	
	@Enumerated(EnumType.STRING)
	private FilingStatus filingStatus;
	
	// Tax Liability (how much tax is owed)
	private BigDecimal taxLiability;
	
	// Tax Paid (how much tax has been paid)
	private BigDecimal taxPaid;
	
	public enum FilingStatus {
		SINGLE,
		MARRIED_JOINT,
		MARRIED_SEPARATE,
		BUSINESS
	}
	
	// Method to calculate balanceDue dynamically
	public BigDecimal getBalanceDue() {
		return this.taxLiability.subtract(this.taxPaid);
	}
	
	/*
	 * totalIncome
	 * totalDeductions
	 * taxableIncome -- Income after deductions
	 * taxLiability -- Tax amount calculated
	 * taxPaid -- 
	 * balanceDue
	 */
}
