import React from 'react';
import { Card, Row, Col, Badge, Container, Alert } from 'react-bootstrap';

const Dashboard = ({ user, setCurrentPage }) => {

  const getRoleColor = (role) => {
    switch(role) {
      case 'lecturer': return 'primary';
      case 'student': return 'success';
      case 'principal_lecturer': return 'warning';
      case 'program_leader': return 'danger';
      default: return 'secondary';
    }
  };

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'lecturer': return 'Lecturer';
      case 'student': return 'Student';
      case 'principal_lecturer': return 'Principal Lecturer';
      case 'program_leader': return 'Program Leader';
      default: return role;
    }
  };

  // Card click handlers
  const handleViewReports = () => {
    setCurrentPage('reports');
  };

  const handleMyClasses = () => {
    setCurrentPage('classes');
  };

  const handleRateLectures = () => {
    setCurrentPage('ratings');
  };

  const handleSubmitReport = () => {
    setCurrentPage('report');
  };

  const handleAssignLecturers = () => {
    setCurrentPage('assign-lecturers');
  };

  return (
    <Container>
      <div className="text-center mb-5">
        <h1>Welcome back, {user.name}! </h1>
        <p className="lead text-muted">
          You are logged in as <Badge bg={getRoleColor(user.role)}>{getRoleDisplayName(user.role)}</Badge>
        </p>
        
        {/* Role-specific welcome message */}
        {user.role === 'student' && (
          <Alert variant="info">
            <strong>🎓 Student Access:</strong> Click on any card below to access different features.
          </Alert>
        )}
        {user.role === 'lecturer' && (
          <Alert variant="info">
            <strong>👨‍🏫 Lecturer Access:</strong> Click on cards to manage your teaching activities.
          </Alert>
        )}
        {user.role === 'principal_lecturer' && (
          <Alert variant="warning">
            <strong>📋 Principal Lecturer Access:</strong> Manage courses, provide feedback, and assign lecturers.
          </Alert>
        )}
      </div>
      
      <Row className="g-4">
        {/* View Reports Card */}
        <Col md={6} lg={4}>
          <Card 
            className="h-100 text-center border-primary clickable-card"
            onClick={handleViewReports}
            style={{cursor: 'pointer'}}
          >
            <Card.Body>
              <div className="mb-3" style={{fontSize: '2rem'}}>📊</div>
              <Card.Title>View Reports</Card.Title>
              <Card.Text>
                {user.role === 'student' 
                  ? 'See all lecture reports and class activities' 
                  : 'View all submitted lecture reports and analytics'
                }
              </Card.Text>
              <Badge bg="primary">Click to View</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Submit Report Card - Only for teaching staff */}
        {(user.role === 'lecturer' || user.role === 'principal_lecturer' || user.role === 'program_leader') && (
          <Col md={6} lg={4}>
            <Card 
              className="h-100 text-center border-success clickable-card"
              onClick={handleSubmitReport}
              style={{cursor: 'pointer'}}
            >
              <Card.Body>
                <div className="mb-3" style={{fontSize: '2rem'}}>📝</div>
                <Card.Title>Submit Reports</Card.Title>
                <Card.Text>
                  Create and submit new lecture reports for your classes
                </Card.Text>
                <Badge bg="success">Click to Submit</Badge>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {/* Classes Card */}
        <Col md={6} lg={4}>
          <Card 
            className="h-100 text-center border-warning clickable-card"
            onClick={handleMyClasses}
            style={{cursor: 'pointer'}}
          >
            <Card.Body>
              <div className="mb-3" style={{fontSize: '2rem'}}>🏫</div>
              <Card.Title>
                {user.role === 'student' ? 'My Classes' : 
                 user.role === 'principal_lecturer' ? 'Manage Classes' : 'My Classes'}
              </Card.Title>
              <Card.Text>
                {user.role === 'student' 
                  ? 'View your enrolled classes and schedules' 
                  : user.role === 'principal_lecturer'
                  ? 'Manage classes and assign lecturers'
                  : 'Manage your classes and schedules'
                }
              </Card.Text>
              <Badge bg="warning" text="dark">Click to View</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Ratings Card */}
        {(user.role === 'student' || user.role === 'lecturer') && (
          <Col md={6} lg={4}>
            <Card 
              className="h-100 text-center border-info clickable-card"
              onClick={handleRateLectures}
              style={{cursor: 'pointer'}}
            >
              <Card.Body>
                <div className="mb-3" style={{fontSize: '2rem'}}>⭐</div>
                <Card.Title>
                  {user.role === 'student' ? 'Rate Lectures' : 'View Ratings'}
                </Card.Title>
                <Card.Text>
                  {user.role === 'student' 
                    ? 'Provide feedback and rate your lectures' 
                    : 'View student ratings and feedback for your classes'
                  }
                </Card.Text>
                <Badge bg="info">Click to Access</Badge>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {/* Assign Lecturers Card - For Principal Lecturer */}
        {user.role === 'principal_lecturer' && (
          <Col md={6} lg={4}>
            <Card 
              className="h-100 text-center border-danger clickable-card"
              onClick={handleAssignLecturers}
              style={{cursor: 'pointer'}}
            >
              <Card.Body>
                <div className="mb-3" style={{fontSize: '2rem'}}>👨‍🏫</div>
                <Card.Title>Assign Lecturers</Card.Title>
                <Card.Text>
                  Assign lecturers to courses and manage teaching assignments
                </Card.Text>
                <Badge bg="danger">Click to Manage</Badge>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Rest of your existing stats and activity sections */}
      {/* ... */}
    </Container>
  );
};

export default Dashboard;