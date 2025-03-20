import React, { useEffect, useState } from "react";
import { Accordion, Card, Table } from "react-bootstrap";
import axios from "axios";

export const Sectors = () => {
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    // Fetch sectors and tax returns data from an API
    const fetchSectors = async () => {
      try {
        const response = await axios.get("/sector"); // Replace with your API endpoint
        setSectors(response.data);
      } catch (error) {
        console.error("Error fetching sector data", error);
      }
    };

    fetchSectors();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Sectors</h2>
      <Accordion defaultActiveKey="0">
        {sectors.map((sector, index) => (
          <Accordion.Item eventKey={index.toString()} key={sector.id}>
            <Accordion.Header>{sector.sectorName}</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Spouse Name</th>
                    <th>Filing Status</th>
                    <th>Tax Year</th>
                    <th>Tax Liability</th>
                    <th>Tax Paid</th>
                    <th>Balance Due</th>
                  </tr>
                </thead>
                <tbody>
                  {sector.taxReturns.map((taxReturn) => (
                    <tr key={taxReturn.id}>
                      <td>{`${taxReturn.client.firstName} ${taxReturn.client.lastName}`}</td>
                      <td>
                        {taxReturn.spouse
                          ? `${taxReturn.spouse.firstName} ${taxReturn.spouse.lastName}`
                          : "N/A"}
                      </td>
                      <td>{taxReturn.filingStatus}</td>
                      <td>{taxReturn.taxYear}</td>
                      <td>{taxReturn.taxLiability.toFixed(2)}</td>
                      <td>{taxReturn.taxPaid.toFixed(2)}</td>
                      <td>{taxReturn.balanceDue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};
