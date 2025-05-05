import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { resetPassword, error } = useAuth();
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!password || !confirmPassword) {
            setFormError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters long');
            return;
        }

        const success = await resetPassword(token, password);
        if (success) {
            navigate('/signin', { state: { message: 'Password has been reset successfully' } });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Reset Password</h2>
                {(formError || error) && (
                    <div className="error-message">{formError || error}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword; 