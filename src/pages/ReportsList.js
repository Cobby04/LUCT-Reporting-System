import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup, Button, Container } from 'react-bootstrap';
import API from '../services/api';

const ReportsList = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch reports when component loads
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await API.get('/reports');
        setReports(response.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter reports based on search term
  const filteredReports = reports.filter(report =>
    report.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.topic_covered?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.lecturer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendancePercentage = (present, total) => {
    if (!total || total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  const getAttendanceVariant = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner"></div>
        <p className="mt-3">Loading reports...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="shadow">
        <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📊 All Lecture Reports</h4>
          <Badge bg="light" text="dark">{filteredReports.length} reports</Badge>
        </Card.Header>
        <Card.Body>
          {/* Search Bar */}
          <InputGroup className="mb-4">
            <Form.Control
              placeholder="Search by class name, course, topic, or lecturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              🔍 Search
            </Button>
          </InputGroup>

          {/* Reports Table */}
          {filteredReports.length > 0 ? (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Course</th>
                    <th>Week</th>
                    <th>Date</th>
                    <th>Attendance</th>
                    <th>Topic</th>
                    <th>Lecturer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const attendancePercentage = getAttendancePercentage(
                      report.student_present,
                      report.total_registered_students
                    );
                    
                    return (
                      <tr key={report.id}>
                        <td>
                          <strong>{report.class_name}</strong>
                        </td>
                        <td>{report.course_name} ({report.course_code})</td>
                        <td>
                          <Badge bg="primary">{report.reporting_week}</Badge>
                        </td>
                        <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={getAttendanceVariant(attendancePercentage)}>
                            {report.student_present}/{report.total_registered_students} ({attendancePercentage}%)
                          </Badge>
                        </td>
                        <td>
                          <small className="text-muted">
                            {report.topic_covered?.length > 50 
                              ? report.topic_covered.substring(0, 50) + '...'
                              : report.topic_covered
                            }
                          </small>
                        </td>
                        <td>{report.lecturer_name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <h5 className="text-muted">No reports found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search terms' : 'No reports have been submitted yet'}
              </p>
              <Button variant="primary" onClick={() => setSearchTerm('')}>
                View All Reports
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportsList;