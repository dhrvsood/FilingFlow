package com.skillstorm.cpa.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "client", schema = "cpa", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"first_name", "last_name", "email"})
})
public class Client {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "client_id")
	private int id;
	
	@Column(name = "first_name", nullable = false)
	private String firstName;
	
	@Column(name = "last_name", nullable = false)
	private String lastName;
	
	@Column(name = "email", nullable = false, unique = true)
	private String email;
	
	@Column(name = "address", nullable = false)
	private String address;
	
	@OneToMany(mappedBy = "client")
//	@JsonIgnoreProperties("client")
	private List<TaxReturn> taxReturns;
	
	public Client() {
		super();
	}

	public Client(int id, String firstName, String lastName, String email, String address, List<TaxReturn> taxReturns) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.address = address;
		this.taxReturns = taxReturns;
	}

	public int getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getEmail() {
		return email;
	}

	public String getAddress() {
		return address;
	}

	public List<TaxReturn> getTaxReturns() {
		return taxReturns;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setTaxReturns(List<TaxReturn> taxReturns) {
		this.taxReturns = taxReturns;
	}

	@Override
	public String toString() {
		return "Client [id=" + id + ", firstName=" + firstName + ", lastName=" + lastName + ", email=" + email
				+ ", address=" + address + ", taxReturns=" + taxReturns + "]";
	}
	
	
}
