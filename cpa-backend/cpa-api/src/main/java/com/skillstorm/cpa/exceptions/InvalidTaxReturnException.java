package com.skillstorm.cpa.exceptions;

// if the id of the spouse and client is same in creation (caused by dropdown) then throw an error
public class InvalidTaxReturnException extends RuntimeException {
	public InvalidTaxReturnException(String message) {
		super(message);
	}
}
