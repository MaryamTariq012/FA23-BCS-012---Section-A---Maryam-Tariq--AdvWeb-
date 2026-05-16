import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

function Voting() {
    const { id } = useParams(); // URL se dynamic election ID lena
    const [election, setElection] = useState(null);
    const [candidate, setCandidate] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpecificElection = async () => {
            if (!id) return;

            // Database se wahi election lana jis par click hua hai
            const { data, error } = await supabase
                .from('elections')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setElection(data);
            } else {
                console.error("Error fetching election:", error);
            }
            setFetchLoading(false);
        };

        fetchSpecificElection();
    }, [id]);

    const handleVote = async (e) => {
        e.preventDefault();
        if (!candidate) {
            alert("Pehle kisi aik candidate ko select karein!");
            return;
        }
        if (!election) return;

        setLoading(true);

        // Check karein user logged in hai ya nahi
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Vote dalne ke liye pehle login karein!");
            navigate('/login');
            return;
        }

        // DYNAMIC DUPLICATE VOTE CHECK: 
        // Check karein ke kya is voter_email ne is election_id par pehle vote kiya hai?
        const { data: existingVote, error: checkError } = await supabase
            .from('votes')
            .select('*')
            .eq('election_id', election.id)
            .eq('voter_email', user.email);

        if (existingVote && existingVote.length > 0) {
            alert("⚠️ Aap is election mein pehle hi apna vote cast kar chuke hain!");
            setLoading(false);
            navigate(`/results/${election.id}`); // Direct results page par bhejna
            return;
        }

        // Agar vote nahi dala, toh ab insert karein
        const { error } = await supabase
            .from('votes')
            .insert([
                {
                    election_id: parseInt(election.id), // ID ko integer format mein convert karna
                    voter_email: user.email,
                    candidate_name: candidate
                }
            ]);

        setLoading(false);

        if (error) {
            alert("Error casting vote: " + error.message);
        } else {
            alert("🎉 Your vote has been successfully casted!");
            navigate(`/results/${election.id}`); // Vote ke baad direct isi election ke live results dikhana
        }
    };

    if (fetchLoading) return <h3 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading Voting Booth...</h3>;
    if (!election) return <h3 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Election Not Found.</h3>;

    // Database se real candidates uthana
    const electionCandidates = election.candidates && Array.isArray(election.candidates)
        ? election.candidates
        : [];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxWidth: '450px', margin: '60px auto', background: '#ffffff', padding: '40px 35px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '55px', marginBottom: '10px' }}>🗳️</div>
                <h2 style={{ fontSize: '28px', color: '#1e272e', margin: '0 0 5px 0', fontWeight: '700' }}>Voting Booth</h2>
                <h4 style={{ color: '#4834d4', margin: '5px 0 5px 0', fontSize: '18px' }}>{election.title}</h4>
                <p style={{ color: '#576574', marginBottom: '30px', fontSize: '15px' }}>{election.description}</p>

                <form onSubmit={handleVote}>
                    {electionCandidates.length === 0 ? (
                        <p style={{ color: '#d63031', fontWeight: '600', margin: '20px 0' }}>
                            ⚠️ Is election ke liye koi candidates database mein majood nahi hain!
                        </p>
                    ) : (
                        electionCandidates.map((cand, index) => (
                            <div
                                key={index}
                                onClick={() => setCandidate(cand)}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '15px', margin: '12px 0',
                                    border: candidate === cand ? '2px solid #4834d4' : '2px solid #edeff2',
                                    background: candidate === cand ? '#f1f0ff' : '#fff',
                                    borderRadius: '12px', cursor: 'pointer', transition: '0.2s', fontWeight: '600', color: '#2d3436'
                                }}
                            >
                                <input
                                    type="radio"
                                    name="candidate"
                                    checked={candidate === cand}
                                    onChange={() => { }}
                                    style={{ marginRight: '15px', transform: 'scale(1.2)' }}
                                />
                                👤 {cand}
                            </div>
                        ))
                    )}

                    <button
                        type="submit"
                        disabled={loading || electionCandidates.length === 0}
                        style={{
                            width: '100%', padding: '15px', marginTop: '20px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                            background: electionCandidates.length === 0 ? '#b2bec3' : 'linear-gradient(to right, #4834d4, #686de0)', color: 'white',
                            boxShadow: '0 8px 15px rgba(72, 52, 212, 0.25)'
                        }}
                    >
                        {loading ? 'Submitting Ballot...' : 'Submit Secure Vote'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Voting;