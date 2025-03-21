package com.skillstorm.cpa.exceptions;

// when adjusting the capacity for a given taxYear or adding to a taxYear that's already full
public class InvalidYearException extends RuntimeException {
	public InvalidYearException(String message) {
		super(message);
	}
}
