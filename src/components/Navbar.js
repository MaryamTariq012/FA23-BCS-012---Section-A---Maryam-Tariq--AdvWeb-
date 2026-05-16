import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        alert("🔒 Logged out successfully!");
        navigate('/login');
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        background: '#1e272e',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    };

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🗳️</span>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px', fontWeight: '700' }}>Election System</Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#a4b0be', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
                <Link to="/create-election" style={{ color: '#a4b0be', textDecoration: 'none', fontWeight: '600' }}>Create Election</Link>
                {/* Global results link jo pehle ki tarah sab mix dikhayega */}
                <Link to="/overall-results" style={{ color: '#a4b0be', textDecoration: 'none', fontWeight: '600' }}>Overall Results</Link>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '13px', color: '#2ed573', background: 'rgba(46, 213, 115, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                            👤 {user.email}
                        </span>
                        <button onClick={handleLogout} style={{ padding: '8px 18px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;