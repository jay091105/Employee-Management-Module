import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate('/signin');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {currentUser?.name}</h1>
                <button onClick={handleSignOut} className="signout-button">
                    Sign Out
                </button>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h2>Employee Management</h2>
                    <div className="dashboard-actions">
                        <button 
                            onClick={() => navigate('/employees/new')}
                            className="action-button"
                        >
                            Create Employee
                        </button>
                        <button 
                            onClick={() => navigate('/employees')}
                            className="action-button"
                        >
                            View Employees
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 