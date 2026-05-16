import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';

function Results() {
    const { id } = useParams(); // URL se election ID lena
    const navigate = useNavigate();
    const [election, setElection] = useState(null);
    const [votesData, setVotesData] = useState({});
    const [totalVotes, setTotalVotes] = useState(0);
    const [hasVoted, setHasVoted] = useState(false); // Check ke user ne vote dala ya nahi
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResultsAndCheckVoter = async () => {
            if (!id) return;

            // 1. Check karein ke logged in user kaun hai
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Results dekhne ke liye pehle login karein!");
                navigate('/login');
                return;
            }

            // 2. Check karein ke kya is user ne is election mein vote cast kiya hai?
            const { data: userVote, error: userVoteError } = await supabase
                .from('votes')
                .select('*')
                .eq('election_id', id)
                .eq('voter_email', user.email);

            if (userVote && userVote.length > 0) {
                setHasVoted(true); // User authorized hai results dekhne ke liye
            }

            // 3. Election details lekar aana
            const { data: electionData, error: electionError } = await supabase
                .from('elections')
                .select('*')
                .eq('id', id)
                .single();

            if (electionError || !electionData) {
                console.error("Error fetching election:", electionError);
                setLoading(false);
                return;
            }
            setElection(electionData);

            // 4. Is election ke saare votes lekar aana calculation ke liye
            const { data: votesList, error: votesError } = await supabase
                .from('votes')
                .select('candidate_name')
                .eq('election_id', id);

            if (!votesError && votesList) {
                setTotalVotes(votesList.length);

                const counts = {};
                const candidatesList = electionData.candidates && Array.isArray(electionData.candidates)
                    ? electionData.candidates
                    : [];

                candidatesList.forEach(cand => {
                    counts[cand] = 0;
                });

                votesList.forEach(vote => {
                    if (counts[vote.candidate_name] !== undefined) {
                        counts[vote.candidate_name] += 1;
                    }
                });

                setVotesData(counts);
            }
            setLoading(false);
        };

        fetchResultsAndCheckVoter();
    }, [id, navigate]);

    if (loading) return <h3 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Calculating Standings...</h3>;
    if (!election) return <h3 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>No Results Found.</h3>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxWidth: '550px', margin: '50px auto', background: '#ffffff', padding: '40px 35px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '55px', marginBottom: '10px' }}>📊</div>
                <h2 style={{ fontSize: '28px', color: '#1e272e', margin: '0 0 5px 0', fontWeight: '700' }}>Live Standings</h2>
                <h4 style={{ color: '#4834d4', margin: '5px 0 25px 0', fontSize: '18px' }}>{election.title}</h4>

                {/* VIVA LOGIC: Agar user ne vote nahi dala, toh use standings nahi dikhayenge */}
                {!hasVoted ? (
                    <div style={{ padding: '20px', background: '#fff5f5', borderRadius: '12px', border: '1px solid #ffcccb', margin: '20px 0' }}>
                        <p style={{ color: '#d63031', fontWeight: '600', fontSize: '15px', margin: 0 }}>
                            🔒 Live Results locked hain! Pehle is election mein apna vote submit karein, uske baad aap live results dekh sakenge.
                        </p>
                        <button
                            onClick={() => navigate(`/voting/${election.id}`)}
                            style={{ marginTop: '15px', padding: '10px 20px', background: '#3f51b5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Go to Voting Booth 🗳️
                        </button>
                    </div>
                ) : (
                    // Agar vote daal diya hai, toh bars show honge
                    <div style={{ textAlign: 'left', marginTop: '20px' }}>
                        {Object.keys(votesData).length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#576574' }}>Is election mein abhi tak koi vote nahi dala gaya.</p>
                        ) : (
                            Object.entries(votesData).map(([candidateName, voteCount], index) => {
                                const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;

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
                                                    backgroundColor: index % 2 === 0 ? '#2ed573' : '#1e90ff',
                                                    height: '100%',
                                                    borderRadius: '10px',
                                                    transition: 'width 0.5s ease-in-out'
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <hr style={{ border: 'none', borderTop: '1px solid #edeff2', margin: '25px 0' }} />
                        <h3 style={{ fontSize: '18px', color: '#2d3436', fontWeight: '700', textAlign: 'center' }}>Total Polled: {totalVotes}</h3>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '20px', width: '100%', padding: '12px', background: '#576574', color: 'white',
                        border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default Results;