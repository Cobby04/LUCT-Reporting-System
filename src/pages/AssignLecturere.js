// src/pages/AssignLecturers.js
import React, { useState } from 'react';
import { Container, Card, Table, Button, Form, Modal, Row, Col, Badge, Alert } from 'react-bootstrap';

const AssignLecturers = ({ user, setCurrentPage }) => {
    const [classes, setClasses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedLecturer, setSelectedLecturer] = useState('');
    const [message, setMessage] = useState('');

    // Sample data
    React.useEffect(() => {
        const sampleClasses = [
            {
                id: 1,
                code: 'BIWD2110',
                name: 'Web Design',
                course: 'BSc Software Engineering',
                lecturer: 'Dr. Smith',
                venue: 'Lab A-101',
                schedule: 'Mon 10:00-12:00, Wed 14:00-16:00',
                totalStudents: 45,
                status: 'active'
            },
            {
                id: 2,
                code: 'BISD2101',
                name: 'Database Systems',
                course: 'BSc Software Engineering',
                lecturer: 'Not Assigned',
                venue: 'Room B-205',
                schedule: 'Tue 09:00-11:00, Thu 13:00-15:00',
                totalStudents: 38,
                status: 'active'
            },
            {
                id: 3,
                code: 'BICS2103',
                name: 'Algorithms',
                course: 'BSc Computer Science',
                lecturer: 'Not Assigned',
                venue: 'Lab C-102',
                schedule: 'Mon 08:00-10:00, Fri 10:00-12:00',
                totalStudents: 52,
                status: 'upcoming'
            }
        ];

        const sampleLecturers = [
            { id: 1, name: 'Dr. Smith', specialization: 'Web Technologies', currentLoad: 2, maxLoad: 4 },
            { id: 2, name: 'Prof. Johnson', specialization: 'Database Systems', currentLoad: 1, maxLoad: 4 },
            { id: 3, name: 'Dr. Brown', specialization: 'Algorithms', currentLoad: 3, maxLoad: 4 },
            { id: 4, name: 'Dr. Wilson', specialization: 'Software Engineering', currentLoad: 2, maxLoad: 4 },
            { id: 5, name: 'Dr. Davis', specialization: 'Mobile Development', currentLoad: 1, maxLoad: 4 }
        ];

        setClasses(sampleClasses);
        setLecturers(sampleLecturers);
    }, []);

    const handleAssignLecturer = (classItem) => {
        setSelectedClass(classItem);
        setSelectedLecturer('');
        setShowAssignModal(true);
    };

    const confirmAssignment = () => {
        if (selectedClass && selectedLecturer) {
            const updatedClasses = classes.map(cls => 
                cls.id === selectedClass.id 
                    ? { ...cls, lecturer: selectedLecturer }
                    : cls
            );
            setClasses(updatedClasses);
            setShowAssignModal(false);
            setSelectedClass(null);
            setSelectedLecturer('');
            setMessage(`✅ Successfully assigned ${selectedLecturer} to ${selectedClass.name}`);
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getLoadColor = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return 'danger';
        if (percentage >= 75) return 'warning';
        return 'success';
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'upcoming': return 'warning';
            case 'completed': return 'secondary';
            default: return 'secondary';
        }
    };

    const unassignedCount = classes.filter(cls => cls.lecturer === 'Not Assigned').length;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Assign Lecturers</h2>
                    <p className="text-muted">Manage lecturer assignments for classes in your stream</p>
                </div>
                <Button variant="outline-secondary" onClick={() => setCurrentPage('dashboard')}>
                    ← Back to Dashboard
                </Button>
            </div>

            {message && <Alert variant="success">{message}</Alert>}

            <Row>
                <Col lg={8}>
                    {/* Classes Needing Assignment */}
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Classes Needing Assignment</h5>
                            <Badge bg={unassignedCount > 0 ? 'danger' : 'success'}>
                                {unassignedCount} unassigned
                            </Badge>
                        </Card.Header>
                        <Card.Body>
                            {unassignedCount === 0 ? (
                                <div className="text-center text-muted py-4">
                                    <h6>🎉 All classes are assigned!</h6>
                                    <p>All classes currently have lecturers assigned.</p>
                                </div>
                            ) : (
                                <Table responsive striped hover>
                                    <thead>
                                        <tr>
                                            <th>Class Code</th>
                                            <th>Class Name</th>
                                            <th>Course</th>
                                            <th>Venue</th>
                                            <th>Schedule</th>
                                            <th>Students</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes
                                            .filter(cls => cls.lecturer === 'Not Assigned')
                                            .map(classItem => (
                                                <tr key={classItem.id}>
                                                    <td><strong>{classItem.code}</strong></td>
                                                    <td>{classItem.name}</td>
                                                    <td>{classItem.course}</td>
                                                    <td>{classItem.venue}</td>
                                                    <td><small>{classItem.schedule}</small></td>
                                                    <td>{classItem.totalStudents}</td>
                                                    <td>
                                                        <Badge bg={getStatusVariant(classItem.status)}>
                                                            {classItem.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Button 
                                                            variant="primary" 
                                                            size="sm"
                                                            onClick={() => handleAssignLecturer(classItem)}
                                                        >
                                                            Assign Lecturer
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>

                    {/* All Classes Overview */}
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">All Classes Overview</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Class Code</th>
                                        <th>Class Name</th>
                                        <th>Lecturer</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map(classItem => (
                                        <tr key={classItem.id}>
                                            <td><strong>{classItem.code}</strong></td>
                                            <td>{classItem.name}</td>
                                            <td>
                                                {classItem.lecturer}
                                                {classItem.lecturer === 'Not Assigned' && (
                                                    <Badge bg="danger" className="ms-1">!</Badge>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg={getStatusVariant(classItem.status)}>
                                                    {classItem.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {classItem.lecturer === 'Not Assigned' ? (
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => handleAssignLecturer(classItem)}
                                                    >
                                                        Assign
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => handleAssignLecturer(classItem)}
                                                    >
                                                        Reassign
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* Available Lecturers */}
                    <Card className="bg-light">
                        <Card.Header>
                            <h6 className="mb-0">👨‍🏫 Available Lecturers</h6>
                        </Card.Header>
                        <Card.Body>
                            {lecturers.map(lecturer => (
                                <div key={lecturer.id} className="mb-3 p-2 border rounded">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <strong>{lecturer.name}</strong>
                                            <br />
                                            <small className="text-muted">{lecturer.specialization}</small>
                                        </div>
                                        <Badge bg={getLoadColor(lecturer.currentLoad, lecturer.maxLoad)}>
                                            {lecturer.currentLoad}/{lecturer.maxLoad}
                                        </Badge>
                                    </div>
                                    <div className="mt-2">
                                        <small>
                                            Workload: {lecturer.currentLoad} of {lecturer.maxLoad} classes
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Assign Lecturer Modal */}
            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Lecturer to Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClass && (
                        <>
                            <div className="mb-3">
                                <p><strong>Class:</strong> {selectedClass.name} ({selectedClass.code})</p>
                                <p><strong>Course:</strong> {selectedClass.course}</p>
                                <p><strong>Students:</strong> {selectedClass.totalStudents}</p>
                                <p><strong>Schedule:</strong> {selectedClass.schedule}</p>
                            </div>
                            
                            <Form.Group>
                                <Form.Label>Select Lecturer</Form.Label>
                                <Form.Select 
                                    value={selectedLecturer}
                                    onChange={(e) => setSelectedLecturer(e.target.value)}
                                >
                                    <option value="">Choose a lecturer...</option>
                                    {lecturers.map(lecturer => (
                                        <option 
                                            key={lecturer.id} 
                                            value={lecturer.name}
                                            disabled={lecturer.currentLoad >= lecturer.maxLoad}
                                        >
                                            {lecturer.name} - {lecturer.specialization} 
                                            ({lecturer.currentLoad}/{lecturer.maxLoad} classes)
                                            {lecturer.currentLoad >= lecturer.maxLoad && ' - FULL'}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Lecturers at maximum workload (4 classes) cannot be assigned
                                </Form.Text>
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmAssignment} disabled={!selectedLecturer}>
                        Assign Lecturer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AssignLecturers;