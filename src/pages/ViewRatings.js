// src/pages/ViewRatings.js
import React, { useState } from 'react';
import { Container, Card, Table, Badge, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const ViewRatings = ({ user, setCurrentPage }) => {
    const [ratings, setRatings] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('');

    // Sample ratings data for principal lecturer to view
    const sampleRatings = [
        {
            id: 1,
            student: 'John Student',
            course: 'BIWD2110 - Web Design',
            lecturer: 'Dr. Smith',
            topic: 'React Components',
            rating: 5,
            comment: 'Excellent explanation of React hooks!',
            date: '2024-03-21'
        },
        {
            id: 2,
            student: 'Sarah Johnson',
            course: 'BIWD2110 - Web Design',
            lecturer: 'Dr. Smith',
            topic: 'React Components',
            rating: 4,
            comment: 'Good content but could use more examples',
            date: '2024-03-21'
        },
        {
            id: 3,
            student: 'Mike Brown',
            course: 'BISD2101 - Database Systems',
            lecturer: 'Prof. Johnson',
            topic: 'SQL Queries',
            rating: 3,
            comment: 'The pace was a bit fast for beginners',
            date: '2024-03-20'
        },
        {
            id: 4,
            student: 'Emily Davis',
            course: 'BISD2101 - Database Systems',
            lecturer: 'Prof. Johnson',
            topic: 'SQL Queries',
            rating: 5,
            comment: 'Very practical and helpful examples',
            date: '2024-03-20'
        }
    ];

    React.useEffect(() => {
        setRatings(sampleRatings);
    }, []);

    const courses = ['All Courses', 'BIWD2110 - Web Design', 'BISD2101 - Database Systems', 'BICS2103 - Algorithms'];

    const filteredRatings = ratings.filter(rating => {
        if (selectedCourse && selectedCourse !== 'All Courses') {
            return rating.course === selectedCourse;
        }
        return true;
    });

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'success';
        if (rating >= 3.5) return 'warning';
        return 'danger';
    };

    const getAverageRating = (course = null) => {
        const courseRatings = course ? ratings.filter(r => r.course === course) : ratings;
        if (courseRatings.length === 0) return 0;
        const total = courseRatings.reduce((sum, r) => sum + r.rating, 0);
        return (total / courseRatings.length).toFixed(1);
    };

    const getRatingStats = (course = null) => {
        const courseRatings = course ? ratings.filter(r => r.course === course) : ratings;
        const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        courseRatings.forEach(r => stats[r.rating]++);
        return stats;
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Student Ratings Analytics</h2>
                    <p className="text-muted">View and analyze student feedback across all courses</p>
                </div>
                <Button variant="outline-secondary" onClick={() => setCurrentPage('dashboard')}>
                    ← Back to Dashboard
                </Button>
            </div>

            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="display-6 text-primary">{getAverageRating()}</div>
                            <Card.Text>Overall Average Rating</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="display-6 text-success">{ratings.length}</div>
                            <Card.Text>Total Ratings</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="display-6 text-info">{new Set(ratings.map(r => r.course)).size}</div>
                            <Card.Text>Courses Rated</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="display-6 text-warning">{new Set(ratings.map(r => r.lecturer)).size}</div>
                            <Card.Text>Lecturers Rated</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Filter by Course</Form.Label>
                                <Form.Select 
                                    value={selectedCourse} 
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    {courses.map(course => (
                                        <option key={course} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <div className="mt-4">
                                <strong>Current Filter:</strong> {selectedCourse || 'All Courses'} 
                                {selectedCourse && selectedCourse !== 'All Courses' && (
                                    <span className="ms-2">
                                        (Avg: {getAverageRating(selectedCourse)} ⭐)
                                    </span>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Course-specific stats */}
            {selectedCourse && selectedCourse !== 'All Courses' && (
                <Card className="mb-4 bg-light">
                    <Card.Body>
                        <h5>Rating Distribution for {selectedCourse}</h5>
                        <Row>
                            {[5, 4, 3, 2, 1].map(stars => {
                                const stats = getRatingStats(selectedCourse);
                                const percentage = (stats[stars] / filteredRatings.length) * 100;
                                return (
                                    <Col key={stars}>
                                        <div className="text-center">
                                            <div>{stars} ⭐</div>
                                            <div className="fw-bold">{stats[stars]}</div>
                                            <small className="text-muted">({percentage.toFixed(1)}%)</small>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {/* Ratings Table */}
            <Card>
                <Card.Header>
                    <h5 className="mb-0">
                        Student Ratings {selectedCourse && `- ${selectedCourse}`}
                        <Badge bg="primary" className="ms-2">{filteredRatings.length}</Badge>
                    </h5>
                </Card.Header>
                <Card.Body>
                    {filteredRatings.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            No ratings found for the selected filter.
                        </Alert>
                    ) : (
                        <Table responsive striped hover>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Lecturer</th>
                                    <th>Topic</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRatings.map(rating => (
                                    <tr key={rating.id}>
                                        <td>{rating.student}</td>
                                        <td>
                                            <strong>{rating.course}</strong>
                                        </td>
                                        <td>{rating.lecturer}</td>
                                        <td>{rating.topic}</td>
                                        <td>
                                            <Badge bg={getRatingColor(rating.rating)}>
                                                {rating.rating} ⭐
                                            </Badge>
                                        </td>
                                        <td>
                                            {rating.comment && (
                                                <small className="text-muted">"{rating.comment}"</small>
                                            )}
                                        </td>
                                        <td>
                                            <small>{rating.date}</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ViewRatings;