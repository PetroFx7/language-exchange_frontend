'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BackButton from "@/components/BackButton";
import Loader from "@/components/Loader";

export default function OutgoingRequests() {
    const user = useSelector(state => state.user);
    const token = user?.token;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('http://localhost:5000/requests/outgoing', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setRequests(data))
            .finally(() => setLoading(false));
    }, [token]);

    if (!user) return <p>Not logged in</p>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Outgoing Requests</h1>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader />
                </div>
            ) : requests.length === 0 ? (
                <p>No outgoing requests.</p>
            ) : (
                <ul>
                    {requests.map(({ id, tousername, created_at, status }) => (
                        <li key={id} className="border p-4 rounded mb-2 flex justify-between items-center">
                            <div>
                                <p><strong>To:</strong> {tousername}</p>
                                <p className="text-sm text-gray-500">
                                    {created_at ? new Date(created_at).toLocaleString() : 'No date'}
                                </p>
                            </div>
                            <div>
                                <span className="px-3 py-1 rounded bg-gray-200 text-gray-700">{status}</span>
                            </div>
                        </li>
                    ))}

                </ul>
            )}
            <BackButton/>
        </div>
    );
}
