import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col, Tabs, Tab } from 'react-bootstrap';
import API from '../services/api';

const Login = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student', // Default to student
    faculty: 'ICT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', loginData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/register', registerData);
      setError('✅ Registration successful! Please login.');
      setActiveTab('login');
      // Auto-fill login form with registered credentials
      setLoginData({
        email: registerData.email,
        password: registerData.password
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center align-items-center min-vh-100">
      <Col md={6} lg={5}>
        <Card className="shadow">
          <Card.Header className="bg-primary text-white text-center">
            <h4 className="mb-0"> LUCT Reporting System</h4>
          </Card.Header>
          <Card.Body className="p-4">
            {error && (
              <Alert variant={error.includes('✅') ? 'success' : 'danger'}>
                {error}
              </Alert>
            )}
            
            <Tabs 
              activeKey={activeTab} 
              onSelect={(tab) => setActiveTab(tab)} 
              className="mb-3"
            >
              {/* LOGIN TAB */}
              <Tab eventKey="login" title="Login">
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>
              </Tab>

              {/* REGISTER TAB */}
              <Tab eventKey="register" title=" Register">
                <Form onSubmit={handleRegister}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={registerData.role}
                      onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                    >
                      <option value="student"> Student</option>
                      <option value="lecturer"> Lecturer</option>
                      <option value="principal_lecturer"> Principal Lecturer</option>
                      <option value="program_leader"> Program Leader</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Faculty</Form.Label>
                    <Form.Select
                      value={registerData.faculty}
                      onChange={(e) => setRegisterData({...registerData, faculty: e.target.value})}
                    >
                      <option value="FICT"> Faculty of ICT</option>
                      <option value="Business"> Faculty of Business</option>
                      <option value="Engineering"> Faculty of Engineering</option>
                      <option value="Arts"> Faculty of Arts</option>
                      <option value=" Public Relation">Faculty of Com, Media & Tech</option>
                    </Form.Select>
                  </Form.Group>

                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Create Account'}
                  </Button>
                </Form>
              </Tab>
            </Tabs>

            <div className="text-center mt-3">
              <small className="text-muted">
                {activeTab === 'login' 
                  ? "Don't have an account? Click Register tab above ↑" 
                  : "Already have an account? Click Login tab above ↑"
                }
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;