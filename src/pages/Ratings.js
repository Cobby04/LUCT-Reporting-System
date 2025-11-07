import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, ListGroup, Badge, Spinner } from 'react-bootstrap';

const Ratings = ({ user, setCurrentPage }) => {
    const [ratings, setRatings] = useState([]);
    const [availableReports, setAvailableReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState('');
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    // Load available reports and user's ratings
    useEffect(() => {
        loadData();
    }, [user.id]);

    const loadData = async () => {
        setLoading(true);
        setDebugInfo('Starting to load data...');
        try {
            setDebugInfo('Trying to fetch available reports...');
            
            // TEMPORARY: Use mock data instead of API call
            const mockReports = [
                {
                    id: 1,
                    course_name: 'Web Design',
                    course_code: 'BIWD2110',
                    topic_taught: 'React Components',
                    lecturer_name: 'Dr. Smith',
                    date_of_lecture: '2024-03-20'
                },
                {
                    id: 2,
                    course_name: 'Database Systems',
                    course_code: 'BISD2101',
                    topic_taught: 'SQL Queries',
                    lecturer_name: 'Prof. Johnson',
                    date_of_lecture: '2024-03-18'
                }
            ];
            
            setAvailableReports(mockReports);
            setDebugInfo(`Loaded ${mockReports.length} mock reports successfully`);
            
            // Load mock ratings
            const mockRatings = [
                {
                    id: 1,
                    report_id: 1,
                    rating: 5,
                    comments: 'Great lecture!',
                    course_name: 'Web Design',
                    topic_taught: 'React Components',
                    lecturer_name: 'Dr. Smith',
                    created_at: '2024-03-21'
                }
            ];
            
            setRatings(mockRatings);
            
        } catch (error) {
            console.error('Error loading data:', error);
            setDebugInfo(`Error: ${error.message}`);
            setMessage('Error loading data. Using mock data instead.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        setDebugInfo('Submit button clicked');
        
        if (!selectedReport) {
            setMessage('Please select a report to rate');
            setDebugInfo('No report selected');
            return;
        }

        setSubmitting(true);
        setDebugInfo('Starting submit process...');
        
        try {
            // Prepare data for API
            const ratingData = {
                report_id: parseInt(selectedReport),
                user_id: user.id,
                rating: rating,
                comments: comments
            };

            setDebugInfo(`Prepared data: ${JSON.stringify(ratingData)}`);

            // SIMULATE API CALL - Replace this with actual API call later
            setDebugInfo('Simulating API call...');
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create mock response
            const mockResponse = {
                success: true,
                message: 'Rating saved successfully (SIMULATED)',
                data: {
                    id: Date.now(),
                    ...ratingData,
                    created_at: new Date().toISOString()
                }
            };

            setDebugInfo(`Mock response: ${JSON.stringify(mockResponse)}`);

            if (mockResponse.success) {
                setMessage('✅ Rating submitted successfully! (This is a simulation)');
                
                // Add to local state
                const selectedReportData = availableReports.find(r => r.id === parseInt(selectedReport));
                const newRating = {
                    id: mockResponse.data.id,
                    ...ratingData,
                    course_name: selectedReportData.course_name,
                    topic_taught: selectedReportData.topic_taught,
                    lecturer_name: selectedReportData.lecturer_name,
                    created_at: mockResponse.data.created_at
                };
                
                setRatings([newRating, ...ratings]);
                setDebugInfo(`Added new rating to local state: ${JSON.stringify(newRating)}`);
                
                // Clear form
                setComments('');
                setRating(5);
                setSelectedReport('');
                
                setDebugInfo('Form cleared successfully');
            } else {
                setMessage(`❌ Error: ${mockResponse.error}`);
                setDebugInfo(`Mock error: ${mockResponse.error}`);
            }
            
        } catch (error) {
            console.error('Error submitting rating:', error);
            setDebugInfo(`Catch error: ${error.message}`);
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setSubmitting(false);
            setDebugInfo(prev => prev + ' - Submit process completed');
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'success';
        if (rating >= 3) return 'warning';
        return 'danger';
    };

    // Test if button click works
    const testButtonClick = () => {
        setDebugInfo('Test button clicked at: ' + new Date().toLocaleTimeString());
        setMessage('Test button working!');
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading available reports...</p>
                <p className="text-muted small">Debug: {debugInfo}</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Rate Your Lectures</h2>
                <Button variant="outline-secondary" onClick={() => setCurrentPage('dashboard')}>
                    ← Back to Dashboard
                </Button>
            </div>

            {/* Test Button */}
            <Card className="mb-3 border-warning">
                <Card.Body className="text-center">
                    <Button variant="warning" onClick={testButtonClick}>
                        Test Button Click
                    </Button>
                    <p className="mt-2 small text-muted">Click this to test if buttons work</p>
                </Card.Body>
            </Card>

            <Row>
                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Submit New Rating</h5>
                        </Card.Header>
                        <Card.Body>
                            {message && (
                                <Alert variant={message.includes('❌') ? 'danger' : 'success'}>
                                    {message}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleSubmitRating}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Lecture to Rate</Form.Label>
                                    <Form.Select 
                                        value={selectedReport} 
                                        onChange={(e) => {
                                            setSelectedReport(e.target.value);
                                            setDebugInfo(`Selected report: ${e.target.value}`);
                                        }}
                                        required
                                        disabled={availableReports.length === 0 || submitting}
                                    >
                                        <option value="">Choose a lecture...</option>
                                        {availableReports.map(report => (
                                            <option key={report.id} value={report.id}>
                                                {report.course_name} - {report.topic_taught} 
                                                ({new Date(report.date_of_lecture).toLocaleDateString()})
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {availableReports.length === 0 && (
                                        <Form.Text className="text-muted">
                                            No lectures available for rating at the moment.
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                {selectedReport && (
                                    <Card className="mb-3 bg-light">
                                        <Card.Body>
                                            <h6>Lecture Details:</h6>
                                            <p><strong>Course:</strong> {availableReports.find(r => r.id === parseInt(selectedReport))?.course_name}</p>
                                            <p><strong>Topic:</strong> {availableReports.find(r => r.id === parseInt(selectedReport))?.topic_taught}</p>
                                            <p><strong>Lecturer:</strong> {availableReports.find(r => r.id === parseInt(selectedReport))?.lecturer_name}</p>
                                        </Card.Body>
                                    </Card>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Rating: {rating} ⭐</Form.Label>
                                    <Form.Range 
                                        min="1" 
                                        max="5" 
                                        value={rating} 
                                        onChange={(e) => {
                                            setRating(parseInt(e.target.value));
                                            setDebugInfo(`Rating changed to: ${e.target.value}`);
                                        }}
                                        disabled={submitting}
                                    />
                                    <div className="d-flex justify-content-between text-muted">
                                        <small>Poor (1⭐)</small>
                                        <small>Excellent (5⭐)</small>
                                    </div>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Your Comments</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3}
                                        value={comments}
                                        onChange={(e) => {
                                            setComments(e.target.value);
                                            setDebugInfo(`Comments length: ${e.target.value.length}`);
                                        }}
                                        placeholder="What did you like about this lecture? Any suggestions for improvement?"
                                        disabled={submitting}
                                    />
                                </Form.Group>
                                
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        size="lg"
                                        disabled={submitting || availableReports.length === 0 || !selectedReport}
                                    >
                                        {submitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Saving to Database...
                                            </>
                                        ) : (
                                            'Submit Rating (Simulated)'
                                        )}
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => {
                                            setDebugInfo('Clear form clicked');
                                            setComments('');
                                            setRating(5);
                                            setSelectedReport('');
                                            setMessage('Form cleared');
                                        }}
                                    >
                                        Clear Form
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Rating History */}
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                Your Rating History 
                                <Badge bg="secondary" className="ms-2">{ratings.length}</Badge>
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {ratings.length === 0 ? (
                                <p className="text-muted text-center">No ratings submitted yet.</p>
                            ) : (
                                <ListGroup variant="flush">
                                    {ratings.map(item => (
                                        <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">{item.course_name}</div>
                                                <div className="mb-1">{item.topic_taught}</div>
                                                {item.comments && (
                                                    <div className="text-muted mb-1">"{item.comments}"</div>
                                                )}
                                                <small className="text-muted">
                                                    Rated on {new Date(item.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <Badge bg={getRatingColor(item.rating)} pill className="fs-6">
                                                {item.rating} ⭐
                                            </Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* Debug Information */}
                    <Card className="border-danger">
                        <Card.Header className="bg-danger text-white">
                            <h6 className="mb-0">🐛 Debug Information</h6>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>User ID:</strong> {user.id}</p>
                            <p><strong>User Name:</strong> {user.name}</p>
                            <p><strong>Available Reports:</strong> {availableReports.length}</p>
                            <p><strong>Selected Report:</strong> {selectedReport}</p>
                            <p><strong>Current Rating:</strong> {rating}</p>
                            <p><strong>Comments Length:</strong> {comments.length}</p>
                            <p><strong>Submitting:</strong> {submitting ? 'Yes' : 'No'}</p>
                            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                            <hr />
                            <p><strong>Last Action:</strong></p>
                            <div className="bg-dark text-light p-2 rounded small" style={{maxHeight: '100px', overflowY: 'auto'}}>
                                {debugInfo || 'No actions yet...'}
                            </div>
                            <Button 
                                variant="outline-dark" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => setDebugInfo('')}
                            >
                                Clear Debug
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Ratings;