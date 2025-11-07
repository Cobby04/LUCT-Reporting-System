import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './App.css';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import ReportsList from './pages/ReportsList';
import Ratings from './pages/Ratings';
import Classes from './pages/Classes';
import ViewRatings from './pages/ViewRatings';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
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

  // Render the current page based on state
  const renderCurrentPage = () => {
    if (!user && currentPage === 'login') {
      return <Login onLogin={handleLogin} />;
    }

    if (!user) {
      return <Login onLogin={handleLogin} />;
    }

    switch(currentPage) {
      case 'dashboard':
        return <Dashboard user={user} setCurrentPage={setCurrentPage} />;
      case 'report':
        return <ReportForm user={user} setCurrentPage={setCurrentPage} />;
      case 'reports':
        return <ReportsList user={user} setCurrentPage={setCurrentPage} />;
      case 'ratings':
        return <Ratings user={user} setCurrentPage={setCurrentPage} />;
      case 'view-ratings':
        return <ViewRatings user={user} setCurrentPage={setCurrentPage} />;
      case 'classes':
        return <Classes user={user} setCurrentPage={setCurrentPage} />;
      default:
        return <Dashboard user={user} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {/* Navigation Bar - Only show when logged in */}
      {user && (
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>LUCT Reporting System</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => setCurrentPage('dashboard')}>
                  Dashboard
                </Nav.Link>
                
                {/* Only show "Submit Report" to lecturers, principals, and program leaders */}
                {(user.role === 'lecturer' || user.role === 'principal_lecturer' || user.role === 'program_leader') && (
                  <Nav.Link onClick={() => setCurrentPage('report')}>
                    Submit Report
                  </Nav.Link>
                )}
                
                {/* Everyone can view reports */}
                <Nav.Link onClick={() => setCurrentPage('reports')}>
                  View Reports
                </Nav.Link>

                {/* Classes - Available to all roles */}
                <Nav.Link onClick={() => setCurrentPage('classes')}>
                  {user.role === 'student' ? 'My Classes' : 'Classes'}
                </Nav.Link>

                {/* Rate Lectures - ONLY for students */}
                {user.role === 'student' && (
                  <Nav.Link onClick={() => setCurrentPage('ratings')}>
                    Rate Lectures
                  </Nav.Link>
                )}

                {/* View Ratings - ONLY for principal lecturers */}
                {user.role === 'principal_lecturer' && (
                  <Nav.Link onClick={() => setCurrentPage('view-ratings')}>
                    View Ratings
                  </Nav.Link>
                )}
              </Nav>
              <Nav>
                <Navbar.Text className="me-3">
                  Signed in as: <strong>{user.name}</strong> ({getRoleDisplayName(user.role)})
                </Navbar.Text>
                <Nav.Link onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      {/* Main Content */}
      <Container fluid={!user} className={user ? 'mt-4' : ''}>
        {renderCurrentPage()}
      </Container>
    </div>
  );
}

export default App;