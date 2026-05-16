import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

function CreateElection() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [candidateInput, setCandidateInput] = useState(''); // Comma-separated names ke liye
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title || !description || !candidateInput) {
            alert("Saari fields fill karna lazmi hain!");
            return;
        }

        setLoading(true);

        // User input se names ko alag karke array banana (e.g., "Imran, Nawaz" -> ["Imran", "Nawaz"])
        const candidatesArray = candidateInput
            .split(',')
            .map(name => name.trim())
            .filter(name => name !== "");

        const { error } = await supabase
            .from('elections')
            .insert([
                {
                    title,
                    description,
                    candidates: candidatesArray // Database mein array send ho raha hai
                }
            ]);

        setLoading(false);

        if (error) {
            alert("Error creating election: " + error.message);
        } else {
            alert("🎉 New Election Created Successfully!");
            navigate('/'); // Home page par wapis jana
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxWidth: '500px', margin: '40px auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2d3436' }}>➕ Create New Election</h2>
                <form onSubmit={handleCreate}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600' }}>Election Title:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ccc' }} placeholder="e.g., General Election 2026" />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600' }}>Description:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ccc' }} placeholder="Election details..." />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: '600' }}>Candidates (Comma separated):</label>
                        <input type="text" value={candidateInput} onChange={(e) => setCandidateInput(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ccc' }} placeholder="Ali, Hamza, Zain" />
                        <small style={{ color: '#636e72' }}>Naam likh kar darmiyan mein comma (,) lagayein.</small>
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        {loading ? 'Creating...' : 'Launch Election 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateElection;