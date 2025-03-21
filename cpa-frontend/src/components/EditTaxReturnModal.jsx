import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

export const EditTaxReturnModal = ({ show, handleClose, selectedTaxReturn }) => {
  const taxReturnId = selectedTaxReturn?.id || '';

  const [taxYears, setTaxYears] = useState([]);
  const [clients, setClients] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [taxYear, setTaxYear] = useState('');   // to indicate which year has been selected  
  const [filingStatus, setFilingStatus] = useState('');
  const [primaryClientId, setPrimaryClientId] = useState('');
  const [spouseClientId, setSpouseClientId] = useState('');
  const [sectorId, setSectorId] = useState(''); // to indicate which sector has been selected
  const [taxLiabilityPrimary, setTaxLiabilityPrimary] = useState('');
  const [taxPaidPrimary, setTaxPaidPrimary] = useState('');
  const [taxLiabilitySpouse, setTaxLiabilitySpouse] = useState('');
  const [taxPaidSpouse, setTaxPaidSpouse] = useState('');
  
  const [showError, setShowError] = useState(false); // state for showing the error alert
  const [errorMessage, setErrorMessage] = useState(''); // state for error message

  // fetch tax years from /capacity and sectors from /sector on load
  useEffect(() => {
    if (show) {
        axios.get('/capacity').then(response => {
            setTaxYears(response.data);
        }).catch(err => console.error(err));

        axios.get('/sector').then(response => {
            setSectors(response.data);
        }).catch(err => console.error(err));
    }
    }, [show]); // Adding the `show` dependency here

    // Update form fields when selectedTaxReturn changes
    useEffect(() => {
        if (selectedTaxReturn) {
        setTaxYear(selectedTaxReturn?.taxYear || '');
        setFilingStatus(selectedTaxReturn?.filingStatus || '');
 // Fetch clients for the selected tax year
        setPrimaryClientId(selectedTaxReturn?.client.id || '');
        fetchClientsForYear(selectedTaxReturn?.taxYear, selectedTaxReturn?.client.id);
        // getClientById(primaryClientId);
        setSpouseClientId(selectedTaxReturn?.spouse?.id || '');
        setSectorId(selectedTaxReturn?.sector.id || '');
        // setSpouseSectorId(selectedTaxReturn?.spouseSectorId || '');
        setTaxLiabilityPrimary(selectedTaxReturn?.taxLiability || '');
        setTaxPaidPrimary(selectedTaxReturn?.taxPaid || '');
        setTaxLiabilitySpouse(selectedTaxReturn?.taxLiabilitySpouse || '');
        setTaxPaidSpouse(selectedTaxReturn?.taxPaidSpouse || '');
        }
    }, [selectedTaxReturn]);


    const handleTaxYearChange = (selectedYear) => {
        // Update the taxYear state
        setTaxYear(selectedYear);
        setFilingStatus(''); // Reset filing status when tax year changes
        setPrimaryClientId(''); // Reset primary client when tax year changes
        setSpouseClientId(''); // Reset spouse client when tax year changes

        // Fetch clients who don't have returns for the selected year
        fetchClientsForYear(selectedYear, );
      };
      
  // Fetch clients without returns for the selected year INCLUDING the client you want to edit
  const fetchClientsForYear = async (year, clientId) => {
    try {
      // Fetch all clients apart from the current year
      const response = await fetch(`/client/year/${year}`);
      const data = await response.json();

      // Add clientId to the list of clients
      const clientResponse = await fetch(`/client/${clientId}`);
      const clientData = await clientResponse.json();

      const updatedClients = [...data, clientData];
      console.log(updatedClients);
      setClients(updatedClients); // Set clients to state
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleSectorChange = (event) => {
    const selectedSectorId = event.target.value;
    setSectorId(selectedSectorId);
  }

  const handleFilingStatusChange = (response) => {
    setFilingStatus(response);
    // setPrimaryClientId('');
    // setSpouseClientId('');
    // setTaxLiabilityPrimary('');
    // setTaxPaidPrimary('');
    // setTaxLiabilitySpouse('');
    // setTaxPaidSpouse('');
  };

  const filteredClientsForSpouse = clients.filter(client => client.id !== primaryClientId);

  const handlePrimaryClientChange = (clientId) => {
    setPrimaryClientId(clientId);
    setSpouseClientId(''); // Reset spouse client when primary client changes
  };

  const handleSpouseClientChange = (clientId) => {
    setSpouseClientId(clientId);
  };

  const handleSubmit = () => {
    const taxReturnData = {
        clientId: parseInt(primaryClientId),
        spouseId: filingStatus === 'married_joint' || filingStatus === 'married_separate' ? parseInt(spouseClientId) : null,
        sectorId: parseInt(sectorId), 
        filingStatus: filingStatus,
        taxYear: parseInt(taxYear),
        taxLiability: parseFloat(taxLiabilityPrimary),
        taxPaid: parseFloat(taxPaidPrimary)
    };
    console.log(taxReturnData);

    // if married_separate, we have to post 2 requests
    if (filingStatus === 'married_separate') {
        const spouseTaxReturnData = {
            clientId: parseInt(spouseClientId),
            spouseId: parseInt(primaryClientId),
            sectorId: parseInt(sectorId),
            filingStatus: filingStatus,
            taxYear: parseInt(taxYear),
            taxLiability: parseFloat(taxLiabilitySpouse),
            taxPaid: parseFloat(taxPaidSpouse),
        }

        // primary client post request
        // axios.post('/return', taxReturnData).then(response => {
        //     // handleClose(); // Close the modal on successful submission
        //   }).catch(error => {
        //     console.error('Error submitting tax return:', error);
        //     setShowError(true); // Show error alert
        //     setErrorMessage(error.message);
        //   });
        
        // // spouse client post request
        // axios.post('/return', spouseTaxReturnData).then(response => {   
        //     handleClose(); // Close the modal on successful submission
        // }).catch(error => {
        //     console.error('Error submitting tax return:', error);
        //     setShowError(true); // Show error alert
        //     setErrorMessage(error.message);
        // });
    }
    else {
        // single or married_joint post request
        axios.put(`/return/${taxReturnId}`, taxReturnData).then(response => {
            handleClose(); // Close the modal on successful submission
        }).catch(error => {
            console.error('Error submitting tax return:', error);
            setShowError(true); // Show error alert
            setErrorMessage(error.message);
        });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit {selectedTaxReturn?.client.id} {selectedTaxReturn?.client.firstName} {selectedTaxReturn?.client.lastName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>

          {/* Tax Year */}
          <Form.Group>
            <Form.Label>Tax Year</Form.Label>
            <Form.Control as="select" value={taxYear || ""} onChange={e => handleTaxYearChange(e.target.value)}>
            <option value="" disabled>Select a tax year</option>
              {taxYears.map(year => (
                <option key={year.capacityId} value={year.taxYear}>
                  {year.taxYear}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Filing Status */}
          <Form.Group>
            <Form.Label>Filing Status</Form.Label>
            <Form.Control as="select" value={filingStatus || ""} onChange={e => handleFilingStatusChange(e.target.value)}>
              <option value="" disabled>Select Filing Status</option>
              <option value="single">Single</option>
              <option value="married_joint">Married Joint</option>
              <option value="married_separate">Married Separate</option>
              <option value="business">Business</option>
            </Form.Control>
          </Form.Group>

          {/* Sector */}
          <Form.Group>
              <Form.Label>Sector</Form.Label>
              <Form.Control as="select" value={sectorId || ''} onChange={handleSectorChange}>
                <option value="" disabled>Select a sector</option>
                {sectors.map(sector => (
                  <option key={sector.id} value={sector.id}>
                    {sector.sectorName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

          <Row>
          {/* Primary Client Fields */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Primary Client</Form.Label>
              {/* <Form.Control type="text" value={primaryClientId} /> */}
              <Form.Control as="select" value={primaryClientId} onChange={e => handlePrimaryClientChange(e.target.value)}>
                {clients.map((client, index) => (
                  <option key={index + "-" + client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Tax Liability (Primary)</Form.Label>
              <Form.Control type="number" value={taxLiabilityPrimary} onChange={e => setTaxLiabilityPrimary(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tax Paid (Primary)</Form.Label>
              <Form.Control type="number" value={taxPaidPrimary} onChange={e => setTaxPaidPrimary(e.target.value)} />
            </Form.Group>
          </Col>

          {/* Spouse Client Fields */}
          {(filingStatus === 'married_joint' || filingStatus === 'married_separate') && (
            <Col md={6}>
              <Form.Group>
                <Form.Label>Spouse Client</Form.Label>
                <Form.Control as="select" value={spouseClientId} onChange={e => handleSpouseClientChange(e.target.value)}>
                  <option value="" disabled>Select Spouse Client</option>
                  {filteredClientsForSpouse.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {filingStatus === 'married_separate' && (
                <>

                  <Form.Group>
                    <Form.Label>Tax Liability (Spouse)</Form.Label>
                    <Form.Control type="number" value={taxLiabilitySpouse} onChange={e => setTaxLiabilitySpouse(e.target.value)} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Tax Paid (Spouse)</Form.Label>
                    <Form.Control type="number" value={taxPaidSpouse} onChange={e => setTaxPaidSpouse(e.target.value)} />
                  </Form.Group>
                </>
              )}
            </Col>
          )}
        </Row>
      </Form>
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          {errorMessage}
        </Alert>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Update Tax Return
      </Button>
    </Modal.Footer>
  </Modal>
);
};
