import React, { useEffect, useState } from "react";
import { Accordion, Badge, Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";

export const Sectors = () => {


  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSector, setNewSector] = useState({ sectorName: '' , taxReturns: []});
  const [updatedSector, setUpdatedSector] = useState({ sectorName: '' });

	useEffect(() => {
		// Fetch sectors and tax returns data from an API
		const fetchSectors = async () => {
			try {
				await axios.get("/api/sector").then(response => setSectors(response.data));
			} catch (error) {
				console.error("Error fetching sector data", error);
			}
		};
		fetchSectors();
	}, []);

  // delete confirmation modal
  const handleDelete = (sector) => {
		setSelectedSector(sector);
		setShowDeleteModal(true);
 }

	const confirmDelete = async () => {
		try {
			await axios.delete(`/api/sector/${selectedSector.id}`);
			setSectors(sectors.filter(sector => sector.id !== selectedSector.id));
			setShowDeleteModal(false);
		} catch (error) {
			console.error("Error deleting sector", error);
		}
	}

  // Open edit modaland populate with sector name
  const handleEdit = (sector) => {
		setSelectedSector(sector);
	  setUpdatedSector(sector);
	  setShowEditModal(true);
  }

   // Handle changes in the edit form
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUpdatedSector((prevState) => ({ ...prevState, [name]: value }));
	};

	// Confirm update
	const confirmUpdate = async () => {
		try {
			await axios.put(`/api/sector/${selectedSector.id}`, updatedSector);
			setSectors(sectors.map((sector) => (sector.id === selectedSector.id ? updatedSector : sector)));
		} catch (error) {
			console.error('Error updating sector:', error);
		} finally {
			setShowEditModal(false);
		}
	};

	// Open the add sector modal
	const handleAddNewSector = () => {
		setNewSector({ sectorName: '' });
		setShowAddModal(true);
	};

	// Handle changes in the add sector form
	const handleNewSectorChange = (e) => {
			const { name, value } = e.target;
			setNewSector((prevState) => ({ ...prevState, [name]: value }));
	};

	// Confirm add new sector
	const confirmAdd = async () => {
		try {
			const response = await axios.post('/api/sector', newSector);
			setSectors([...sectors, response.data]);
		} catch (error) {
			console.error('Error adding new sector:', error);
		} finally {
			setShowAddModal(false);
		}
	};

  return (
	<div className="container mt-4">
	  <div className="d-flex justify-content-between align-items-center">
		<h2 className="mb-4">Sectors</h2>
		<Button onClick={handleAddNewSector}>New Sector</Button>
	  </div>
	  <Accordion defaultActiveKey="0">
		{sectors.map((sector, index) => (
		  <Accordion.Item eventKey={index.toString()} key={sector.id}>
			<Accordion.Header as="div" className="d-flex justify-content-between align-items-center w-100">
				<h5 className="flex-grow-1">
					{sector.sectorName} - <Badge bg="primary">{sector.taxReturns !== null ? sector.taxReturns.length : 0}</Badge>
				</h5>
				<div className="d-flex">
					<Button variant="warning" className="me-2" onClick={() => handleEdit(sector)}>Edit</Button>
					<Button variant="danger" className="me-4" disabled={sector.taxReturns !== null ? sector.taxReturns.length : true} onClick={() => handleDelete(sector)}>Delete</Button>
				</div>
				</Accordion.Header>
			<Accordion.Body>
			  <Table striped bordered hover className="text-center">
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

	  {/* Delete Confirmation Modal */}
	  <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
		<Modal.Header closeButton>
			<Modal.Title>Delete Client</Modal.Title>
		</Modal.Header>
		<Modal.Body>Are you sure you want to delete {selectedSector?.sectorName}?</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
			Cancel
			</Button>
			<Button variant="danger" onClick={confirmDelete}>
			Delete
			</Button>
		</Modal.Footer>
		</Modal>

	{/* Edit Sector Modal */}
	<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
	<Modal.Header closeButton>
			<Modal.Title>Edit Sector</Modal.Title>
	</Modal.Header>
	<Modal.Body>
		<Form>
			<Form.Group controlId="sectorName">
					<Form.Label>Sector Name</Form.Label>
					<Form.Control
					type="text"
					name="sectorName"
					value={updatedSector.sectorName}
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

		{/* Add Sector Modal */}
	<Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
	<Modal.Header closeButton>
			<Modal.Title>Add Sector</Modal.Title>
	</Modal.Header>
	<Modal.Body>
		<Form>
			<Form.Group controlId="sectorName">
					<Form.Label>Sector Name</Form.Label>
					<Form.Control
					type="text"
					name="sectorName"
					value={newSector.sectorName}
					onChange={handleNewSectorChange}
					/>
			</Form.Group>
		</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={() => setShowAddModal(false)}>
			Cancel
			</Button>
			<Button variant="primary" onClick={confirmAdd}>
			Update
			</Button>
		</Modal.Footer>
		</Modal>
		</div>
  );
};
