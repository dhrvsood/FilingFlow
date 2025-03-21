import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Button, Modal, Form } from 'react-bootstrap';

export const Settings = () => {
    const [capacities, setCapacities] = useState([]);
    const [counts, setCounts] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedCapacity, setSelectedCapacity] = useState(null);
    const [newCapacity, setNewCapacity] = useState({ taxYear: '', maxNumReturns: '' });

    useEffect(() => {
        // Fetch capacity data
        axios.get('/capacity')
            .then(response => {
                setCapacities(response.data);
                // For each tax year, fetch the count and set it in state
                response.data.forEach(capacity => {
                    axios.get(`/return/count/${capacity.taxYear}`)
                        .then(countResponse => {
                            setCounts(prevCounts => ({
                                ...prevCounts,
                                [capacity.taxYear]: countResponse.data.count
                            }));
                        })
                        .catch(error => console.error(`Failed to fetch count for ${capacity.taxYear}:`, error));
                });
            })
            .catch(error => console.error('Failed to fetch capacities:', error));
    }, []);

    // Handlers for modals
    const handleEdit = (capacity) => {
        setSelectedCapacity(capacity);
        setShowEditModal(true);
    };

    const handleDelete = (capacity) => {
        setSelectedCapacity(capacity);
        setShowDeleteModal(true);
    };

    const handleNew = () => {
        setShowNewModal(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        axios.delete(`/capacity/${selectedCapacity.id}`)
            .then(() => {
                setCapacities(capacities.filter(cap => cap.id !== selectedCapacity.id));
                setShowDeleteModal(false);
            })
            .catch(error => console.error('Failed to delete capacity:', error));
    };

    // Confirm edit
    const confirmEdit = () => {
        axios.put(`/capacity/${selectedCapacity.id}`, selectedCapacity)
            .then(() => {
                setCapacities(capacities.map(cap => cap.id === selectedCapacity.id ? selectedCapacity : cap));
                setShowEditModal(false);
            })
            .catch(error => console.error('Failed to update capacity:', error));
    };

    // Confirm new capacity
    const confirmNew = () => {
        axios.post('/capacity', newCapacity)
            .then(response => {
                setCapacities([...capacities, response.data]);
                setShowNewModal(false);
            })
            .catch(error => console.error('Failed to create new capacity:', error));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-4">Settings</h2>
                <Button onClick={handleNew}>New Tax Year</Button>
            </div>
            <div className="row">
                {capacities.map(capacity => (
                    <div className="col-md-4" key={capacity.id}>
                        <Card className="mb-3">
                            <Card.Body>
                                <h5>Tax Year: {capacity.taxYear}</h5>
                                <p>Max Returns: {capacity.maxNumReturns}</p>
                                <p>Count: {counts[capacity.taxYear]}</p>
                                <ProgressBar now={(counts[capacity.taxYear] || 0) / capacity.maxNumReturns * 100}
                                             label={`${((counts[capacity.taxYear] || 0) / capacity.maxNumReturns * 100).toFixed(2)}%`} />
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="warning" className="me-2" onClick={() => handleEdit(capacity)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(capacity)}>Delete</Button>
                            </Card.Footer>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Capacity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tax Year</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedCapacity?.taxYear || ''}
                                onChange={(e) => setSelectedCapacity({ ...selectedCapacity, taxYear: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Max Number of Returns</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedCapacity?.maxNumReturns || ''}
                                onChange={(e) => setSelectedCapacity({ ...selectedCapacity, maxNumReturns: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={confirmEdit}>Save changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this capacity?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* New Capacity Modal */}
            <Modal show={showNewModal} onHide={() => setShowNewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>New Capacity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tax Year</Form.Label>
                            <Form.Control
                                type="number"
                                value={newCapacity.taxYear}
                                onChange={(e) => setNewCapacity({ ...newCapacity, taxYear: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Max Number of Returns</Form.Label>
                            <Form.Control
                                type="number"
                                value={newCapacity.maxNumReturns}
                                onChange={(e) => setNewCapacity({ ...newCapacity, maxNumReturns: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNewModal(false)}>Close</Button>
                    <Button variant="primary" onClick={confirmNew}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
