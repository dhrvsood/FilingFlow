import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'; // For dropdowns
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; // Sorting icons
import axios from 'axios';
import { AddTaxReturnModal } from '../components/AddTaxReturnModal'; // Import the modal component

export const TaxReturns = () => {
    // modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // add tax return modal
    const [showModal, setShowModal] = useState(false);

    // Function to handle opening the modal
    const handleShowModal = () => {
        setShowModal(true);
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const addNewTaxReturn = (newTaxReturn) => {
        setTaxReturns((prevReturns) => [...prevReturns, newTaxReturn]);
    };

    const [taxReturns, setTaxReturns] = useState([]);
    const [filteredReturns, setFilteredReturns] = useState([]);
    
    // Filters state
    const [filterFilingStatus, setFilterFilingStatus] = useState('');
    const [filterTaxYear, setFilterTaxYear] = useState('');
    const [filterSector, setFilterSector] = useState('');

    // Sort state
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

    // Search state
    const [searchClientName, setSearchClientName] = useState('');
    const [searchSpouseName, setSearchSpouseName] = useState('');

    // Fetch tax returns data when the component mounts
    useEffect(() => {
        const getAllReturns = async () => {
            try {
                const response = await axios.get('/return');
                setTaxReturns(response.data);
                setFilteredReturns(response.data);  // Set both original and filtered data
            } catch (error) {
                console.error('Error fetching tax returns:', error);
            }
        };

        getAllReturns();  // Trigger the fetch on component mount
    }, []);

    // Function to handle sorting
    const handleSort = (field) => {
        const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newSortOrder);

        const sorted = [...filteredReturns].sort((a, b) => {
            const aValue = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
            const bValue = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];
            if (aValue < bValue) return newSortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredReturns(sorted);
    };

    // Determine the appropriate icon for sorting
    const getSortIcon = (field) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    // Function to handle filter changes
    const handleFilterChange = () => {
        let filtered = [...taxReturns];

        if (filterFilingStatus) {
            filtered = filtered.filter(returnData => returnData.filingStatus === filterFilingStatus);
        }
        if (filterTaxYear) {
            filtered = filtered.filter(returnData => returnData.taxYear == filterTaxYear);
        }
        if (filterSector) {
            filtered = filtered.filter(returnData => returnData.sector.sectorName === filterSector);
        }

        // Search by client and spouse name
        if (searchClientName) {
            filtered = filtered.filter(returnData => 
                `${returnData.client.firstName} ${returnData.client.lastName}`.toLowerCase().includes(searchClientName.toLowerCase())
            );
        }

        if (searchSpouseName) {
            filtered = filtered.filter(returnData => 
                returnData.spouse && `${returnData.spouse.firstName} ${returnData.spouse.lastName}`.toLowerCase().includes(searchSpouseName.toLowerCase())
            );
        }

        setFilteredReturns(filtered);
    };

    useEffect(() => {
        handleFilterChange();
    }, [filterFilingStatus, filterTaxYear, filterSector, searchClientName, searchSpouseName]);

    // Extract unique values for dropdowns
    const uniqueFilingStatuses = [...new Set(taxReturns.map(t => t.filingStatus))];
    const uniqueTaxYears = [...new Set(taxReturns.map(t => t.taxYear))];
    const uniqueSectors = [...new Set(taxReturns.map(t => t.sector.sectorName))];

    return (
        <div className="container mt-4 text-center">
            <h2 className="mb-4">Tax Returns</h2>
            <p>Here you can view and manage your tax returns.</p>
            <Row className="mb-4">
                <Col>
                <Button variant="primary" onClick={handleShowModal}>
                    New Tax Return
                </Button>
                </Col>
            </Row>
            {/* Filter Section */}
            <div className="mb-4 d-flex gap-3">
                {/* Filing Status Filter */}
                <Form.Group controlId="filingStatusFilter">
                    <Form.Label>Filing Status</Form.Label>
                    <Form.Select value={filterFilingStatus} onChange={(e) => setFilterFilingStatus(e.target.value)}>
                        <option value="">All</option>
                        {uniqueFilingStatuses.map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Tax Year Filter */}
                <Form.Group controlId="taxYearFilter">
                    <Form.Label>Tax Year</Form.Label>
                    <Form.Select value={filterTaxYear} onChange={(e) => setFilterTaxYear(e.target.value)}>
                        <option value="">All</option>
                        {uniqueTaxYears.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Sector Filter */}
                <Form.Group controlId="sectorFilter">
                    <Form.Label>Sector</Form.Label>
                    <Form.Select value={filterSector} onChange={(e) => setFilterSector(e.target.value)}>
                        <option value="">All</option>
                        {uniqueSectors.map((sector, index) => (
                            <option key={index} value={sector}>{sector}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </div>

            {/* Search Section */}
            <div className="mb-4 d-flex gap-3">
                <Form.Control
                    type="text"
                    placeholder="Search Client Name"
                    value={searchClientName}
                    onChange={(e) => setSearchClientName(e.target.value)}
                />
                <Form.Control
                    type="text"
                    placeholder="Search Spouse Name"
                    value={searchSpouseName}
                    onChange={(e) => setSearchSpouseName(e.target.value)}
                />
            </div>

            {/* Table */}
            <div>
                {filteredReturns.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th onClick={() => handleSort('client.firstName')}>
                                    Client Name {getSortIcon('client.firstName')}
                                </th>
                                <th onClick={() => handleSort('spouse.firstName')}>
                                    Spouse Name {getSortIcon('spouse.firstName')}
                                </th>
                                <th onClick={() => handleSort('filingStatus')}>
                                    Filing Status {getSortIcon('filingStatus')}
                                </th>
                                <th onClick={() => handleSort('taxYear')}>
                                    Tax Year {getSortIcon('taxYear')}
                                </th>
                                <th onClick={() => handleSort('sector.sectorName')}>
                                    Sector {getSortIcon('sector.sectorName')}
                                </th>
                                <th onClick={() => handleSort('taxLiability')}>
                                    Tax Liability {getSortIcon('taxLiability')}
                                </th>
                                <th onClick={() => handleSort('taxPaid')}>
                                    Tax Paid {getSortIcon('taxPaid')}
                                </th>
                                <th onClick={() => handleSort('balanceDue')}>
                                    Balance Due {getSortIcon('balanceDue')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReturns.map((taxReturn, index) => (
                                <tr key={index}>
                                    <td>
                                        <Button onClick={handleShow}>Edit</Button>
                                        <span> </span>
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
                    </Table>
                ) : (
                    <p>No tax returns found.</p>
                )}
            </div>
            {/* Add Tax Return Modal */}
            <AddTaxReturnModal show={showModal} handleClose={handleCloseModal} onTaxReturnAdded={addNewTaxReturn}/>
        </div>
    );
};
