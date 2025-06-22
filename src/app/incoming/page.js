'use client';

import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import BackButton from "@/components/BackButton";
import Loader from "@/components/Loader";

export default function IncomingRequests() {
    const user = useSelector(state => state.user);
    const token = user?.token;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('http://localhost:5000/requests/incoming', {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(res => res.json())
            .then(data => setRequests(data))
            .finally(() => setLoading(false));
    }, [token]);

    const handleAccept = async (id) => {
        await fetch(`http://localhost:5000/requests/${id}/accept`, {
            method: 'POST',
            headers: {Authorization: `Bearer ${token}`},
        });
        setRequests(requests.filter(r => r.id !== id));
    };

    const handleDecline = async (id) => {
        await fetch(`http://localhost:5000/requests/${id}/decline`, {
            method: 'POST',
            headers: {Authorization: `Bearer ${token}`},
        });
        setRequests(requests.filter(r => r.id !== id));
    };

    if (!user) return <p>Not logged in</p>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Incoming Requests</h1>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader/>
                </div>
            ) : requests.length === 0 ? (
                <p>No incoming requests.</p>
            ) : (
                <ul>
                    {requests.map(({id, fromUserName, date}) => (
                        <li key={id} className="border p-4 rounded mb-2 flex justify-between items-center">
                            <div>
                                <p><strong>From:</strong> {fromUserName}</p>
                                <p className="text-sm text-gray-500">{new Date(date).toLocaleString()}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleAccept(id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleDecline(id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Decline
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <BackButton/>
        </div>
    );
}
