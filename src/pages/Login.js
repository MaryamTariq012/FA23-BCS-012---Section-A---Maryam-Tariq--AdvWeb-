import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        // Supabase authentication logic
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert(error.message);
        } else {
            alert('Welcome! Identity Verified.');
            navigate('/voting');
        }
    };

    return (
        <div className="container">
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>👤</div>
            <h2>Voter Identity</h2>
            <p>Enter your details to access the digital ballot.</p>

            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Create Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn-primary">
                    Access Ballot
                </button>
            </form>
        </div>
    );
}

export default Login;