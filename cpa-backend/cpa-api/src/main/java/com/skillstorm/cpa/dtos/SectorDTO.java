package com.skillstorm.cpa.dtos;

import java.util.List;

import com.skillstorm.cpa.models.TaxReturn;

public record SectorDTO(String sectorName, List<TaxReturn> taxReturns) {}
