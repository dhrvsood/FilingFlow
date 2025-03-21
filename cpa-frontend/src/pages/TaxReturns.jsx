import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'; // For dropdowns
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; // Sorting icons
import axios from 'axios';
import { AddTaxReturnModal } from '../components/AddTaxReturnModal'; // Import the modal component
import { EditTaxReturnModal } from '../components/EditTaxReturnModal';

export const TaxReturns = () => {
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
        setFilteredReturns((prevReturns) => [...prevReturns, newTaxReturn]);
    };

    // edit modal 
    const [showEditModal, setShowEditModal] = useState(false);
    const handleShowEditModal = (taxReturn) => {
        setSelectedTaxReturn(taxReturn);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    const [taxReturns, setTaxReturns] = useState([]);
    const [filteredReturns, setFilteredReturns] = useState([]);

    const [taxYears, setTaxYears] = useState([]);
    const [sectors, setSectors] = useState([]);
    
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

    // Delete modal
    const [selectedTaxReturn, setSelectedTaxReturn] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    
    // Open delete confirmation modal
    const handleDelete = (taxReturn) => {
        setSelectedTaxReturn(taxReturn);
        setShowDeleteModal(true);
    }

    // Fetch tax returns data when the component mounts
    useEffect(() => {
        axios.get('/capacity').then(response => {
            setTaxYears(response.data);
        }).catch(err => console.error(err));

        axios.get('/sector').then(response => {
            setSectors(response.data);
        }).catch(err => console.error(err));

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

    // Confirm deletion
    const confirmDelete = async () => {
        try {
            await axios.delete(`/return/${selectedTaxReturn.id}`);
            setFilteredReturns(filteredReturns.filter((returnData) => returnData.id !== selectedTaxReturn.id));
        } catch (error) {
            console.error('Error deleting tax return:', error);
        } finally {
            setShowDeleteModal(false);
        }
    }

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
    // const uniqueTaxYears = [...new Set(taxReturns.map(t => t.taxYear))];
    const uniqueTaxYears = taxYears.map(year => year.taxYear);
    const uniqueSectors = [...new Set(taxReturns.map(t => t.sector.sectorName))];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-4">Tax Returns</h2>
            <Button variant="primary" onClick={handleShowModal}>New Tax Return</Button>
            </div>
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
            <div className='text-center'>
                {filteredReturns.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th>
                                    Client Name
                                </th>
                                <th>
                                    Spouse Name
                                </th>
                                <th>
                                    Filing Status
                                </th>
                                <th>
                                    Tax Year
                                </th>
                                <th>
                                    Sector
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
                                        <Button variant="warning" value={taxReturn.id} onClick={() => handleShowEditModal(taxReturn)}>Edit</Button>
                                        <span> </span>
                                        <Button variant="danger" value={taxReturn.id} onClick={() => handleDelete(taxReturn)}>Delete</Button>
                                    </td>
                                    <td>{taxReturn.client.firstName + " " + taxReturn.client.lastName}</td>
                                    <td>{taxReturn.spouse ? `${taxReturn.spouse.firstName} ${taxReturn.spouse.lastName}` : ''}</td>
                                    <td>{taxReturn.filingStatus}</td>
                                    <td>{taxReturn.taxYear}</td>
                                    <td>{taxReturn.sector.sectorName}</td>
                                    <td>{taxReturn.taxLiability.toFixed(2)}</td>
                                    <td>{taxReturn.taxPaid.toFixed(2)}</td>
                                    <td>{taxReturn.balanceDue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No tax returns found.</p>
                )}
            </div>
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Tax Return</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {selectedTaxReturn?.taxYear} Tax Return for: {selectedTaxReturn?.client.firstName} {selectedTaxReturn?.client.lastName} (Filing Status: {selectedTaxReturn?.filingStatus})?
                    {selectedTaxReturn?.spouse && (
                    <div>
                        <br />
                        Spouse: {selectedTaxReturn?.spouse.firstName} {selectedTaxReturn?.spouse.lastName}
                    </div>
                    )}
                </Modal.Body>
                <Modal.Footer>                
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                    Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Tax Return Modal */}
            <EditTaxReturnModal show={showEditModal} handleClose={handleCloseEditModal} selectedTaxReturn={selectedTaxReturn}/>
            {/* Add Tax Return Modal */}
            <AddTaxReturnModal show={showModal} handleClose={handleCloseModal} onTaxReturnAdded={addNewTaxReturn}/>
        </div>
    );
};
