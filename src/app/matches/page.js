'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BackButton from "@/components/BackButton";
import Loader from "@/components/Loader";

export default function Matches() {
    const user = useSelector(state => state.user);
    const token = user?.token;
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('http://localhost:5000/requests/matches', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setMatches(data))
            .finally(() => setLoading(false));
    }, [token]);

    if (!user) return <p>Not logged in</p>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Matches</h1>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader />
                </div>
            ) : matches.length === 0 ? (
                <p>No matches found.</p>
            ) : (
                <ul>
                    {matches.map(({ id, partnerName, matchedAt }) => (
                        <li key={id} className="border p-4 rounded mb-2">
                            <p><strong>Partner:</strong> {partnerName}</p>
                            <p className="text-sm text-gray-500">{new Date(matchedAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
            <BackButton/>
        </div>
    );
}
