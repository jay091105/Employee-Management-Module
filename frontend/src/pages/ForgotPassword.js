import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { forgotPassword, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');

        if (!email) {
            setFormError('Please enter your email address');
            return;
        }

        const success = await forgotPassword(email);
        if (success) {
            setSuccessMessage('Password reset instructions have been sent to your email');
            setEmail('');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Forgot Password</h2>
                {formError && <div className="error-message">{formError}</div>}
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        Reset Password
                    </button>
                </form>
                <div className="auth-links">
                    <Link to="/signin">Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 