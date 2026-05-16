import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Data fetch karne ka function jo delete ke baad bhi call hoga
    const fetchElections = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('elections')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setElections(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchElections();
    }, []);

    // Fixed Delete Function with Row Selection & State Refresh
    const handleDelete = async (electionId) => {
        const confirmDelete = window.confirm("Kya aap is election ko delete karna chahte hain?");
        if (!confirmDelete) return;

        try {
            // 1. Pehle is election se linked saare votes delete karein (Foreign Key Constraint ke liye)
            const { error: voteError } = await supabase
                .from('votes')
                .delete()
                .eq('election_id', electionId);

            if (voteError) {
                alert("Votes delete karne mein masla aaya: " + voteError.message);
                return;
            }

            // 2. Phir main election delete karein aur database row confirmation lein
            const { error: electionError } = await supabase
                .from('elections')
                .delete()
                .eq('id', electionId)
                .select(); // .select() ensures the database successfully completes the delete action

            if (electionError) {
                alert("Election delete nahi ho saka: " + electionError.message);
            } else {
                alert("🗑️ Election successfully deleted!");
                // Screen ko refresh karne ke liye function call
                fetchElections();
            }
        } catch (err) {
            alert("An unexpected error occurred: " + err.message);
        }
    };

    // UI Layout Styling
    const containerStyle = {
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '30px',
        marginTop: '40px'
    };

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '30px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    return (
        <div style={containerStyle}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ color: '#ffffff', fontSize: '42px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                    🗳️ Secure Online Election Platform
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px', fontWeight: '400' }}>
                    Real-time, transparent, and immutable digital voting system.
                </p>

                <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/create-election')}
                        style={{ padding: '14px 28px', background: '#00cc88', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 204, 136, 0.2)' }}
                    >
                        ➕ Create New Election
                    </button>
                    <button
                        onClick={() => navigate('/overall-results')}
                        style={{ padding: '14px 28px', background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                        📊 View Overall Results
                    </button>
                </div>
            </div>

            {/* Elections Grid */}
            {loading ? (
                <h3 style={{ color: 'white', textAlign: 'center', marginTop: '40px' }}>Loading Active Elections...</h3>
            ) : elections.length === 0 ? (
                <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#2d3436', fontSize: '22px' }}>No Active Elections</h3>
                    <p style={{ color: '#636e72' }}>Filhal database mein koi election majood nahi hai. Naya election launch karein!</p>
                </div>
            ) : (
                <div style={gridStyle}>
                    {elections.map((election) => (
                        <div key={election.id} style={cardStyle}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <span style={{ background: '#ffeaa7', color: '#d63031', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>
                                        ACTIVE
                                    </span>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(election.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px' }}
                                        title="Delete Election"
                                    >
                                        🗑️
                                    </button>
                                </div>

                                <h2 style={{ margin: '0 0 8px 0', color: '#1e272e', fontSize: '26px', fontWeight: '700' }}>
                                    {election.title}
                                </h2>
                                <p style={{ color: '#576574', fontSize: '15px', lineHeight: '1.5', marginBottom: '20px' }}>
                                    {election.description}
                                </p>
                            </div>

                            <div>
                                <hr style={{ border: 'none', borderTop: '1px solid #f1f2f6', margin: '20px 0' }} />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <button
                                        onClick={() => navigate(`/voting/${election.id}`)}
                                        style={{
                                            width: '100%', padding: '14px', background: '#4834d4', color: 'white',
                                            border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 6px 15px rgba(72, 52, 212, 0.15)'
                                        }}
                                    >
                                        Enter Voting Booth 🗳️
                                    </button>

                                    <button
                                        onClick={() => navigate(`/results/${election.id}`)}
                                        style={{
                                            width: '100%', padding: '12px', background: '#fff', color: '#4834d4',
                                            border: '2px solid #4834d4', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer'
                                        }}
                                    >
                                        📊 View Live Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;