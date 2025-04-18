package com.skillstorm.cpa.dtos;

import java.util.List;

import com.skillstorm.cpa.models.TaxReturn;

public record ClientDTO(String firstName, String lastName, String email, String address, List<TaxReturn> taxReturns) {}
