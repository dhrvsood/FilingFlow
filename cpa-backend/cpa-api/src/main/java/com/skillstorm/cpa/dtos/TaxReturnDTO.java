package com.skillstorm.cpa.dtos;

import java.math.BigDecimal;

import com.skillstorm.cpa.models.Client;
import com.skillstorm.cpa.models.Sector;
import com.skillstorm.cpa.models.TaxReturn.FilingStatus;

public record TaxReturnDTO(Client client, Client spouse, Sector sector, int taxYear, FilingStatus filingStatus, BigDecimal taxLiability, BigDecimal taxPaid) {

}
