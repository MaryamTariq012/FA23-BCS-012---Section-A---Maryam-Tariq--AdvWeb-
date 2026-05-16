import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

function OverallResults() {
    const [globalVotes, setGlobalVotes] = useState({});
    const [totalGlobalVotes, setTotalGlobalVotes] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllVotesGlobal = async () => {
            // Pure database se bina kisi condition ke saare votes uthana
            const { data, error } = await supabase
                .from('votes')
                .select('candidate_name');

            if (!error && data) {
                setTotalGlobalVotes(data.length);

                const counts = {};
                data.forEach(vote => {
                    counts[vote.candidate_name] = (counts[vote.candidate_name] || 0) + 1;
                });
                setGlobalVotes(counts);
            }
            setLoading(false);
        };

        fetchAllVotesGlobal();
    }, []);

    if (loading) return <h3 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading Overall Analytics...</h3>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxWidth: '600px', margin: '50px auto', background: '#ffffff', padding: '40px 35px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '55px', marginBottom: '10px' }}>🌍</div>
                <h2 style={{ fontSize: '28px', color: '#1e272e', margin: '0 0 5px 0', fontWeight: '700' }}>Overall Platform Results</h2>
                <p style={{ color: '#576574', marginBottom: '30px' }}>System ke saare elections ke kul milakar live statistics.</p>

                <div style={{ textAlign: 'left', marginTop: '20px' }}>
                    {Object.keys(globalVotes).length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#576574' }}>Filhal system mein koi vote cast nahi hua.</p>
                    ) : (
                        Object.entries(globalVotes).map(([candidateName, voteCount], index) => {
                            const percentage = totalGlobalVotes > 0 ? ((voteCount / totalGlobalVotes) * 100).toFixed(1) : 0;

                            return (
                                <div key={index} style={{ marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#2d3436', marginBottom: '8px', fontSize: '15px' }}>
                                        <span>👤 {candidateName}</span>
                                        <span>{voteCount} {voteCount === 1 ? 'Vote' : 'Votes'} ({percentage}%)</span>
                                    </div>
                                    <div style={{ width: '100%', backgroundColor: '#edeff2', borderRadius: '10px', height: '14px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: '#5352ed',
                                                height: '100%',
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <hr style={{ border: 'none', borderTop: '1px solid #edeff2', margin: '25px 0' }} />
                    <h3 style={{ fontSize: '18px', color: '#2d3436', fontWeight: '700', textAlign: 'center' }}>Total Global Votes Polled: {totalGlobalVotes}</h3>
                </div>

                <button
                    onClick={() => navigate('/')}
                    style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#576574', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default OverallResults;