import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import API from '../services/api';

const ReportForm = ({ user }) => {
  const [formData, setFormData] = useState({
    class_id: '',
    reporting_week: '',
    date_of_lecture: '',
    student_present: '',
    topic_covered: '',
    learning_outcomes: '',
    recommendations: '',
    created_by: user.id
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch classes when component loads
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await API.get('/classes');
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await API.post('/reports', {
        ...formData,
        created_by: user.id
      });

      setMessage('✅ Report submitted successfully!');
      
      // Reset form
      setFormData({
        class_id: '',
        reporting_week: '',
        date_of_lecture: '',
        student_present: '',
        topic_covered: '',
        learning_outcomes: '',
        recommendations: '',
        created_by: user.id
      });
    } catch (err) {
      setMessage('❌ Failed to submit report: ' + (err.response?.data?.error || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="shadow">
      <Card.Header className="bg-success text-white">
        <h4 className="mb-0"> Submit Lecture Report</h4>
      </Card.Header>
      <Card.Body>
        {message && (
          <Alert variant={message.includes('✅') ? 'success' : 'danger'}>
            {message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <h5 className="mb-3 border-bottom pb-2"> Basic Information</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Class *</Form.Label>
                <Form.Select
                  value={formData.class_id}
                  onChange={(e) => handleInputChange('class_id', e.target.value)}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} - {cls.course_code}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Week of Reporting *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Week 6"
                  value={formData.reporting_week}
                  onChange={(e) => handleInputChange('reporting_week', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Lecture *</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date_of_lecture}
                  onChange={(e) => handleInputChange('date_of_lecture', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Students Present *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g., 35"
                  value={formData.student_present}
                  onChange={(e) => handleInputChange('student_present', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Teaching Information */}
          <h5 className="mb-3 border-bottom pb-2 mt-4"> Teaching Information</h5>
          <Form.Group className="mb-3">
            <Form.Label>Topic Covered *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the topic you taught in this lecture..."
              value={formData.topic_covered}
              onChange={(e) => handleInputChange('topic_covered', e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Learning Outcomes *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What did students learn from this topic? What were the key takeaways?"
              value={formData.learning_outcomes}
              onChange={(e) => handleInputChange('learning_outcomes', e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Lecturer's Recommendations</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Any recommendations, observations, or notes for improvement?"
              value={formData.recommendations}
              onChange={(e) => handleInputChange('recommendations', e.target.value)}
            />
          </Form.Group>

          <div className="d-grid">
            <Button 
              variant="success" 
              type="submit" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Submitting...' : '📤 Submit Report'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReportForm;