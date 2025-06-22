'use client';

import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import BackButton from "@/components/BackButton";

export default function SearchPage() {
    const user = useSelector(state => state.user);
    const token = user?.token;

    const [languages, setLanguages] = useState([]);
    const [native, setNative] = useState('');
    const [target, setTarget] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/languages')
            .then(res => res.json())
            .then(setLanguages);
    }, []);

    useEffect(() => {
        if (!native && !target) return;
        const params = new URLSearchParams();
        if (native) params.append('native', native);
        if (target) params.append('target', target);

        setLoading(true);
        fetch(`http://localhost:5000/users?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(setUsers)
            .finally(() => setLoading(false));
    }, [native, target, token]);

    const handleSendRequest = async (toUserId) => {
        await fetch('http://localhost:5000/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({to_user_id: toUserId}),
        });
        setUsers(users.map(u => u.id === toUserId ? {...u, requested: true} : u));
    };

    const handleCancelRequest = async (toUserId) => {
        // implement DELETE logic when backend is ready
        setUsers(users.map(u => u.id === toUserId ? {...u, requested: false} : u));
    };

    if (!user) {
        return <div className="p-6 text-red-500">You are not logged in.</div>;
    }

    return (

        <div className="max-w-3xl mx-auto p-6">
            <BackButton/>
            <h1 className="text-2xl font-bold mb-4">Search Partners</h1>

            {/* Filters */}
            <div className="flex space-x-4 mb-6">
                <select
                    className="w-full border rounded px-3 py-2"
                    value={native}
                    onChange={(e) => setNative(e.target.value)}
                >
                    <option value="">Select Native Language</option>
                    {languages.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                </select>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                >
                    <option value="">Select Target Language</option>
                    {languages.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                </select>
            </div>


            {/* Results */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {users.map(u => (
                        <div key={u.id} className="border rounded p-4 bg-white shadow">
                            <h2 className="text-lg font-semibold">{u.full_name}</h2>
                            <p className="text-sm text-gray-500">{u.email}</p>
                            <p className="mt-2">
                                <strong>Native:</strong> {u.languages.filter(l => l.type === 'native').map(l => l.language_id).join(', ')}
                            </p>
                            <p>
                                <strong>Target:</strong> {u.languages.filter(l => l.type === 'target').map(l => l.language_id).join(', ')}
                            </p>

                            {u.requested ? (
                                <button
                                    onClick={() => handleCancelRequest(u.id)}
                                    className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Cancel Request
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSendRequest(u.id)}
                                    className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                >
                                    Send Request
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
