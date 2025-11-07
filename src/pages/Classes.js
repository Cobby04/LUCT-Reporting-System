import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Row, Col, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';

const Classes = ({ user, setCurrentPage }) => {
    const [classes, setClasses] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedLecturer, setSelectedLecturer] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // New class form state
    const [newClass, setNewClass] = useState({
        class_name: '',
        course_name: '',
        course_code: '',
        faculty_name: 'FICT',
        venue: '',
        scheduled_time: '',
        registered_students: 30
    });

    // Sample lecturers for assignment
    const lecturers = [
        { id: 1, name: 'Dr. Smith', specialization: 'Web Technologies' },
        { id: 2, name: 'Prof. Johnson', specialization: 'Database Systems' },
        { id: 3, name: 'Dr. Brown', specialization: 'Algorithms' },
        { id: 4, name: 'Dr. Wilson', specialization: 'Software Engineering' }
    ];

    // Available venues
    const availableVenues = ['MM1', 'MM2', 'MM3', 'MM4', 'MM5', 'MM6', 'MM7', 'Lab A-101', 'Lab B-201', 'Lecture Hall 1'];

    // Available time slots
    const availableTimeSlots = [
        '08:30 - 10:30',
        '10:30 - 12:30', 
        '13:30 - 15:30',
        '15:30 - 17:30'
    ];

    // Load classes data
    useEffect(() => {
        loadClassesFromAPI();
    }, []);

    const loadClassesFromAPI = async () => {
        setLoading(true);
        try {
            // TODO: Replace with your actual API endpoint
            const sampleClassesFromDB = [
                {
                    id: 1,
                    class_name: 'Web Design',
                    faculty_name: 'FICT',
                    registered_students: 45,
                    venue: 'MM5',
                    scheduled_time: '08:30 - 10:30',
                    course_name: 'Web Design',
                    course_code: 'BIWD2110',
                    create_at: '2025-10-18 11:33:07.052896',
                    lecturer: 'Dr. Smith',
                    status: 'active'
                },
                {
                    id: 2,
                    class_name: 'OOP in JAVA',
                    faculty_name: 'FICT',
                    registered_students: 55,
                    venue: 'MM4',
                    scheduled_time: '08:30 - 10:30',
                    course_name: 'OOP in JAVA',
                    course_code: 'BIDS2110',
                    create_at: '2025-10-18 11:33:07.052896',
                    lecturer: 'Prof. Johnson',
                    status: 'active'
                },
                {
                    id: 3,
                    class_name: 'Database Systems',
                    faculty_name: 'FICT',
                    registered_students: 42,
                    venue: 'MM6',
                    scheduled_time: '10:30 - 12:30',
                    course_name: 'Database Management',
                    course_code: 'BIDS2111',
                    create_at: '2025-10-19 11:03:31.187367',
                    lecturer: 'Not Assigned',
                    status: 'active'
                }
            ];
            
            setClasses(sampleClassesFromDB);
            
        } catch (error) {
            console.error('Error loading classes:', error);
            setMessage('Error loading classes from database');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Validate required fields
            if (!newClass.class_name || !newClass.course_name || !newClass.course_code || !newClass.venue || !newClass.scheduled_time) {
                setMessage('❌ Please fill in all required fields');
                setSubmitting(false);
                return;
            }

            // Create new class object
            const classToAdd = {
                id: Date.now(), // Temporary ID
                ...newClass,
                lecturer: 'Not Assigned',
                status: 'active',
                create_at: new Date().toISOString()
            };

            // Add to classes list
            setClasses(prev => [classToAdd, ...prev]);
            
            setMessage('✅ Class created successfully!');
            setShowAddClassModal(false);
            
            // Reset form
            setNewClass({
                class_name: '',
                course_name: '',
                course_code: '',
                faculty_name: 'FICT',
                venue: '',
                scheduled_time: '',
                registered_students: 30
            });

            // TODO: Here you would call your API to save to database
            // await classesAPI.createClass(newClass);
            
        } catch (error) {
            console.error('Error creating class:', error);
            setMessage('❌ Error creating class');
        } finally {
            setSubmitting(false);
        }
    };

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
            setMessage(`✅ Successfully assigned ${selectedLecturer} to ${selectedClass.class_name}`);
            setShowAssignModal(false);
            setSelectedClass(null);
            setSelectedLecturer('');
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'completed': return 'secondary';
            case 'upcoming': return 'warning';
            default: return 'secondary';
        }
    };

    // Count unassigned classes for principal lecturer
    const unassignedCount = classes.filter(cls => cls.lecturer === 'Not Assigned').length;

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading classes...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>
                        {user.role === 'student' ? 'My Classes' : 
                         user.role === 'principal_lecturer' ? 'Manage Classes' : 'My Teaching Classes'}
                    </h2>
                    <p className="text-muted">
                        {user.role === 'student' ? 'View your enrolled classes and schedules' :
                         user.role === 'principal_lecturer' ? 'Create classes and assign lecturers' :
                         'Manage your assigned classes and teaching schedule'}
                    </p>
                </div>
                <div>
                    <Button variant="outline-secondary" onClick={() => setCurrentPage('dashboard')} className="me-2">
                        ← Back to Dashboard
                    </Button>
                    {/* ADD CLASS BUTTON - ONLY FOR PRINCIPAL LECTURER */}
                    {user.role === 'principal_lecturer' && (
                        <Button variant="success" onClick={() => setShowAddClassModal(true)}>
                            + Add New Class
                        </Button>
                    )}
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <Alert variant={message.includes('✅') ? 'success' : 'danger'} dismissible onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}

            {/* Classes Table */}
            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        {user.role === 'student' ? 'Enrolled Classes' : 'Class List'}
                    </h5>
                    {user.role === 'principal_lecturer' && (
                        <Badge bg={unassignedCount > 0 ? 'danger' : 'success'}>
                            {unassignedCount} unassigned
                        </Badge>
                    )}
                </Card.Header>
                <Card.Body>
                    {classes.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <p>No classes found in the database.</p>
                            {user.role === 'principal_lecturer' && (
                                <Button variant="primary" onClick={() => setShowAddClassModal(true)}>
                                    Create Your First Class
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table responsive striped hover>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Class Name</th>
                                    <th>Course Name</th>
                                    <th>Faculty</th>
                                    <th>Lecturer</th>
                                    <th>Venue</th>
                                    <th>Schedule</th>
                                    <th>Students</th>
                                    <th>Status</th>
                                    {user.role === 'principal_lecturer' && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map(classItem => (
                                    <tr key={classItem.id}>
                                        <td>
                                            <strong>{classItem.course_code}</strong>
                                        </td>
                                        <td>{classItem.class_name}</td>
                                        <td>{classItem.course_name}</td>
                                        <td>{classItem.faculty_name}</td>
                                        <td>
                                            {classItem.lecturer || 'Not Assigned'}
                                            {classItem.lecturer === 'Not Assigned' && (
                                                <Badge bg="danger" className="ms-1">!</Badge>
                                            )}
                                        </td>
                                        <td>{classItem.venue}</td>
                                        <td>
                                            <small>{classItem.scheduled_time}</small>
                                        </td>
                                        <td>
                                            {classItem.registered_students}
                                        </td>
                                        <td>
                                            <Badge bg={getStatusVariant(classItem.status)}>
                                                {classItem.status || 'active'}
                                            </Badge>
                                        </td>
                                        {user.role === 'principal_lecturer' && (
                                            <td>
                                                {classItem.lecturer === 'Not Assigned' ? (
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => handleAssignLecturer(classItem)}
                                                    >
                                                        Assign Lecturer
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
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Student-specific additional info */}
            {user.role === 'student' && (
                <Row className="mt-4">
                    <Col md={6}>
                        <Card className="bg-light">
                            <Card.Header>
                                <h6>📚 Upcoming Classes</h6>
                            </Card.Header>
                            <Card.Body>
                                <ul className="list-unstyled">
                                    {classes.slice(0, 3).map(classItem => (
                                        <li key={classItem.id}>
                                            ✅ <strong>{classItem.class_name}</strong> - {classItem.scheduled_time} ({classItem.venue})
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="bg-light">
                            <Card.Header>
                                <h6>🎯 Performance Summary</h6>
                            </Card.Header>
                            <Card.Body>
                                <p><strong>Enrolled Classes:</strong> {classes.length}</p>
                                <p><strong>Total Students in Classes:</strong> {classes.reduce((sum, cls) => sum + cls.registered_students, 0)}</p>
                                <p><strong>Average Class Size:</strong> {Math.round(classes.reduce((sum, cls) => sum + cls.registered_students, 0) / classes.length)}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Principal Lecturer Stats */}
            {user.role === 'principal_lecturer' && (
                <Row className="mt-4">
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <h4 className="text-primary">{classes.length}</h4>
                                <p className="text-muted">Total Classes</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <h4 className="text-success">{classes.length - unassignedCount}</h4>
                                <p className="text-muted">Assigned Classes</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <h4 className="text-warning">{unassignedCount}</h4>
                                <p className="text-muted">Need Assignment</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <h4 className="text-info">
                                    {classes.reduce((sum, cls) => sum + cls.registered_students, 0)}
                                </h4>
                                <p className="text-muted">Total Students</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* ADD CLASS MODAL */}
            <Modal show={showAddClassModal} onHide={() => setShowAddClassModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Class</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddClass}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Class Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newClass.class_name}
                                        onChange={(e) => setNewClass({...newClass, class_name: e.target.value})}
                                        placeholder="e.g., Web Design, Database Systems"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newClass.course_name}
                                        onChange={(e) => setNewClass({...newClass, course_name: e.target.value})}
                                        placeholder="e.g., Web Design, OOP in JAVA"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Code *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newClass.course_code}
                                        onChange={(e) => setNewClass({...newClass, course_code: e.target.value})}
                                        placeholder="e.g., BIWD2110, BIDS2110"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Faculty</Form.Label>
                                    <Form.Select
                                        value={newClass.faculty_name}
                                        onChange={(e) => setNewClass({...newClass, faculty_name: e.target.value})}
                                    >
                                        <option value="FICT">FICT</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Business">Business</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Venue *</Form.Label>
                                    <Form.Select
                                        value={newClass.venue}
                                        onChange={(e) => setNewClass({...newClass, venue: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Venue</option>
                                        {availableVenues.map(venue => (
                                            <option key={venue} value={venue}>{venue}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Schedule Time *</Form.Label>
                                    <Form.Select
                                        value={newClass.scheduled_time}
                                        onChange={(e) => setNewClass({...newClass, scheduled_time: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Time Slot</option>
                                        {availableTimeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Registered Students</Form.Label>
                            <Form.Control
                                type="number"
                                value={newClass.registered_students}
                                onChange={(e) => setNewClass({...newClass, registered_students: parseInt(e.target.value) || 0})}
                                min="1"
                                max="100"
                            />
                            <Form.Text className="text-muted">
                                Number of students enrolled in this class
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddClassModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="success" type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Class'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ASSIGN LECTURER MODAL */}
            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Lecturer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClass && (
                        <>
                            <p><strong>Class:</strong> {selectedClass.class_name}</p>
                            <p><strong>Course:</strong> {selectedClass.course_name} ({selectedClass.course_code})</p>
                            <p><strong>Students:</strong> {selectedClass.registered_students}</p>
                            <p><strong>Schedule:</strong> {selectedClass.scheduled_time}</p>
                            <p><strong>Venue:</strong> {selectedClass.venue}</p>
                            <hr />
                            <Form.Group>
                                <Form.Label>Select Lecturer</Form.Label>
                                <Form.Select 
                                    value={selectedLecturer}
                                    onChange={(e) => setSelectedLecturer(e.target.value)}
                                >
                                    <option value="">Choose a lecturer...</option>
                                    {lecturers.map(lecturer => (
                                        <option key={lecturer.id} value={lecturer.name}>
                                            {lecturer.name} - {lecturer.specialization}
                                        </option>
                                    ))}
                                </Form.Select>
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

export default Classes;