// ------------------------------------------------------------------------------------------
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';


export const Clients = () => {  
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [newClient, setNewClient] = useState({ firstName: '', lastName: '', email: '', address: '' });
    const [updatedClient, setUpdatedClient] = useState({ firstName: '', lastName: '', email: '', address: '' });

    // Fetch clients from the API
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('/client');
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
                console.log("done");
            }
        };
        fetchClients();    
    }, []);

    // Open the delete confirmation modal
    const handleDelete = (client) => {
        setSelectedClient(client);
        setShowDeleteModal(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        try {
        await axios.delete(`/client/${selectedClient.id}`);
        setClients(clients.filter((client) => client.id !== selectedClient.id));
        } catch (error) {
        console.error('Error deleting client:', error);
        } finally {
        setShowDeleteModal(false);
        }
    };

    // Open the edit modal and populate with client data
    const handleEdit = (client) => {
        setSelectedClient(client);
        setUpdatedClient(client); // Prepopulate form with existing client details
        setShowEditModal(true);
    };

    // Handle changes in the edit form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedClient((prevState) => ({ ...prevState, [name]: value }));
    };

    // Confirm update
    const confirmUpdate = async () => {
        try {
        await axios.put(`/client/${selectedClient.id}`, updatedClient);
        setClients(clients.map((client) => (client.id === selectedClient.id ? updatedClient : client)));
        } catch (error) {
        console.error('Error updating client:', error);
        } finally {
        setShowEditModal(false);
        }
    };

    // Open the add client modal
    const handleAddNewClient = () => {
        setNewClient({ firstName: '', lastName: '', email: '', address: '' });
        setShowAddModal(true);
    };

    // Handle changes in the add client form
    const handleNewClientChange = (e) => {
        const { name, value } = e.target;
        setNewClient((prevState) => ({ ...prevState, [name]: value }));
    };

    // Confirm add new client
    const confirmAdd = async () => {
        try {
        const response = await axios.post('/client', newClient);
        setClients([...clients, response.data]);
        } catch (error) {
        console.error('Error adding new client:', error);
        } finally {
        setShowAddModal(false);
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }    

    return (
        <Container>
        <Row className="mb-4">
            <Col>
            <Button variant="primary" onClick={handleAddNewClient}>
                New Client
            </Button>
            </Col>
        </Row>
        <Row>
        {clients.map((client) => (
            <Col key={client.id} xs={12} md={6} lg={4} className="mb-4">
            <Card>
                <Card.Body>
                <Card.Title>
                    {client.firstName} {client.lastName}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{client.email}</Card.Subtitle>
                <Card.Text>{client.address}</Card.Text>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(client)}>
                    Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(client)}>
                    Delete
                </Button>
                </Card.Body>
            </Card>
            </Col>
        ))}
        </Row>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Delete Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {selectedClient?.firstName} {selectedClient?.lastName}?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
            Delete
            </Button>
        </Modal.Footer>
        </Modal>

        {/* Edit Client Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                type="text"
                name="firstName"
                value={updatedClient.firstName}
                onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mt-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                type="text"
                name="lastName"
                value={updatedClient.lastName}
                onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                type="email"
                name="email"
                value={updatedClient.email}
                onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formAddress" className="mt-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                type="text"
                name="address"
                value={updatedClient.address}
                onChange={handleChange}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
            </Button>
            <Button variant="primary" onClick={confirmUpdate}>
            Update
            </Button>
        </Modal.Footer>
        </Modal>

        {/* Add New Client Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Add New Client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    name="firstName"
                    value={newClient.firstName}
                    onChange={handleNewClientChange}
                />
                </Form.Group>
                <Form.Group controlId="formLastName" className="mt-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    name="lastName"
                    value={newClient.lastName}
                    onChange={handleNewClientChange}
                />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={newClient.email}
                    onChange={handleNewClientChange}
                />
                </Form.Group>
                <Form.Group controlId="formAddress" className="mt-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    value={newClient.address}
                    onChange={handleNewClientChange}
                />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
            </Button>
            <Button variant="primary" onClick={confirmAdd}>
                Add
            </Button>
            </Modal.Footer>
        </Modal>
        </Container>
      );
    };