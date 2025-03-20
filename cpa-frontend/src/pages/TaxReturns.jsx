import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

export const TaxReturns = () => {
    // modal
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [taxReturns, setTaxReturns] = useState([]);

    // Fetch tax returns data when the component mounts
    useEffect(() => {
        const getAllReturns = async () => {
            try {
                const response = await axios.get('/return');
                console.log('Tax returns:', response.data);
                setTaxReturns(response.data);  // Store the data in the state
            } catch (error) {
                console.error('Error fetching tax returns:', error);
            }
        };

        getAllReturns();  // Trigger the fetch on component mount
    }, []);  // Empty dependency array to run only once on mount

    return (
        <div className="container mt-4">
            <h2>Tax Returns</h2>
            <p>Here you can view and manage your tax returns.</p>
            
            {/* Display tax returns in a table */}
            <div>
                {taxReturns.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Client Name</th>
                                <th>Spouse Name</th>
                                <th>Filing Status</th>
                                <th>Tax Year</th>
                                <th>Sector</th>
                                <th>Tax Liability</th>
                                <th>Tax Paid</th>
                                <th>Balance Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taxReturns.map((taxReturn, index) => (
                                <tr key={index}>
                                    <td>
                                        <Button onClick={handleShow}>Edit</Button>
                                        <Button variant="danger">Delete</Button>
                                    </td>
                                    <td>{taxReturn.client.firstName + " " + taxReturn.client.lastName}</td>
                                    <td>{taxReturn.spouse ? `${taxReturn.spouse.firstName} ${taxReturn.spouse.lastName}` : ''}</td>
                                    <td>{taxReturn.filingStatus}</td>
                                    <td>{taxReturn.taxYear}</td>
                                    <td>{taxReturn.sector.sectorName}</td>
                                    <td>{taxReturn.taxLiability}</td>
                                    <td>{taxReturn.taxPaid}</td>
                                    <td>{taxReturn.balanceDue}</td>
                                </tr>
                            ))}
                        </tbody>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Tax Return</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Modal body text goes here.</p>
                                <form>
                                    <div>
                                        <label htmlFor="taxLiability">Tax Liability:</label>
                                        <input type="text" id="taxLiability" name="taxLiability" />     
                                    </div>
                                    <label htmlFor="taxPaid">Tax Paid:</label>
                                    <input type="text" id="taxPaid" name="taxPaid" />
                                    <label htmlFor="balanceDue">Balance Due:</label>
                                    <input type="text" id="balanceDue" name="balanceDue" />
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleClose}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Table>
                ) : (
                    <p>No tax returns found or data is loading...</p>
                )}
            </div>
        </div>
    );
}