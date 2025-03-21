package com.skillstorm.cpa.exceptions;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(ExceededCapacityException.class)
	public ResponseEntity<Map<String, Object>> handleExceededCapacityException(ExceededCapacityException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.BAD_REQUEST);
		body.put("error", "Exceeded Capacity");
		body.put("message", ex.getMessage());
		return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST); // 400 Bad Request
	}
	
	@ExceptionHandler(InvalidYearException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidYearException(InvalidYearException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.BAD_REQUEST);
		body.put("error", "Invalid Year");
		body.put("message", ex.getMessage());
		return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST); // 400 Bad Request
	}
	
	@ExceptionHandler(InvalidTaxReturnException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidTaxReturnException(InvalidTaxReturnException ex) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", HttpStatus.BAD_REQUEST);
		body.put("error", "Invalid Tax Return");
		body.put("message", ex.getMessage());
		return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST); // 400 Bad Request
	}
}
