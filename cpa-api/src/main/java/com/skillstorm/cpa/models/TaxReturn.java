package com.skillstorm.cpa.models;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;


@Entity
@Table(name = "tax_return", schema = "cpa", uniqueConstraints = {
		@UniqueConstraint(columnNames = {"client_id", "tax_year"}),
        @UniqueConstraint(columnNames = {"client_id", "spouse_id", "tax_year"})
})
public class TaxReturn {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tax_return_id")
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "client_id", nullable = false, foreignKey = @ForeignKey(name = "fk_client"))
	@JsonIgnoreProperties("taxReturns")
	private Client client;
	
	@ManyToOne
    @JoinColumn(name = "spouse_id", foreignKey = @ForeignKey(name = "fk_spouse_tax"))
	@JsonIgnoreProperties("taxReturns")
	private Client spouse;
	
	@ManyToOne
    @JoinColumn(name = "sector_id", nullable = false, foreignKey = @ForeignKey(name = "fk_sector"))
	@JsonIgnoreProperties("taxReturns")
	private Sector sector;
	
	@Column(name = "tax_year")
	private int taxYear;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "filing_status", nullable = false)
	private FilingStatus filingStatus;
	
	// Tax Liability (how much tax is owed)
	@Column(name = "tax_liability", nullable = false, precision = 10, scale = 2)
	private BigDecimal taxLiability;
	
	// Tax Paid (how much tax has been paid)
	@Column(name = "tax_paid", nullable = false, precision = 10, scale = 2)
	private BigDecimal taxPaid;
	
	public TaxReturn() {
		super();
	}

	public TaxReturn(int id, Client client, Client spouse, Sector sector, int taxYear, FilingStatus filingStatus,
			BigDecimal taxLiability, BigDecimal taxPaid) {
		super();
		this.id = id;
		this.client = client;
		this.spouse = spouse;
		this.sector = sector;
		this.taxYear = taxYear;
		this.filingStatus = filingStatus;
		this.taxLiability = taxLiability;
		this.taxPaid = taxPaid;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Client getClient() {
		return client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

	public Client getSpouse() {
		return spouse;
	}

	public void setSpouse(Client spouse) {
		this.spouse = spouse;
	}

	public Sector getSector() {
		return sector;
	}

	public void setSector(Sector sector) {
		this.sector = sector;
	}

	public int getTaxYear() {
		return taxYear;
	}

	public void setTaxYear(int taxYear) {
		this.taxYear = taxYear;
	}

	public FilingStatus getFilingStatus() {
		return filingStatus;
	}

	public void setFilingStatus(FilingStatus filingStatus) {
		this.filingStatus = filingStatus;
	}

	public BigDecimal getTaxLiability() {
		return taxLiability;
	}

	public void setTaxLiability(BigDecimal taxLiability) {
		this.taxLiability = taxLiability;
	}

	public BigDecimal getTaxPaid() {
		return taxPaid;
	}

	public void setTaxPaid(BigDecimal taxPaid) {
		this.taxPaid = taxPaid;
	}

	// Method to calculate balanceDue dynamically
	public BigDecimal getBalanceDue() {
		return this.taxLiability.subtract(this.taxPaid);
	}
	
	@Override
	public String toString() {
		return "TaxReturn [id=" + id + ", client=" + client + ", spouse=" + spouse + ", sector=" + sector + ", taxYear="
				+ taxYear + ", filingStatus=" + filingStatus + ", taxLiability=" + taxLiability + ", taxPaid=" + taxPaid
				+ "]";
	}

	public enum FilingStatus {
		single,
		married_joint,
		married_separate,
		business
	}
}
