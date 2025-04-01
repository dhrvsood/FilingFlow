package com.skillstorm.cpa.exceptions;

// when adjusting the capacity for a given taxYear or adding to a taxYear that's already full
public class ExceededCapacityException extends RuntimeException {
	public ExceededCapacityException(String message) {
		super(message);
	}
}
