'use client';

import { useState, useEffect } from 'react';

export default function LanguageSelector({ user, setMessage, dispatch }) {
    const [nativeLang, setNativeLang] = useState('');
    const [targetLang, setTargetLang] = useState('');
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    const token = user.token;

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const res = await fetch('http://localhost:5000/languages');
                const data = await res.json();
                setLanguages(data);
            } catch (err) {
                console.error('Failed to load languages', err);
                setMessage('Failed to load languages');
            }
        };

        fetchLanguages();

        const userNative = user.languages?.find(l => l.type === 'native')?.language_id;
        const userTarget = user.languages?.find(l => l.type === 'target')?.language_id;
        setNativeLang(userNative || '');
        setTargetLang(userTarget || '');
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        setMessage('');

        if (!nativeLang || !targetLang) {
            setMessage('Please select both languages');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/users/me/languages', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    native: [nativeLang],
                    target: [targetLang],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || 'Update failed');
            } else {
                const updatedRes = await fetch('http://localhost:5000/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const updatedUser = await updatedRes.json();
                dispatch({ type: 'user/setUser', payload: updatedUser });


                setMessage('Languages updated successfully');            }
        } catch (err) {
            console.error(err);
            setMessage('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Native Language</label>
                <select
                    value={nativeLang}
                    onChange={(e) => setNativeLang(Number(e.target.value))}
                    className="w-full mt-1 border rounded px-3 py-2"
                >
                    <option value="">Select native language</option>
                    {languages.map(lang => (
                        <option key={lang.id} value={lang.id}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Target Language</label>
                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(Number(e.target.value))}
                    className="w-full mt-1 border rounded px-3 py-2"
                >
                    <option value="">Select target language</option>
                    {languages.map(lang => (
                        <option key={lang.id} value={lang.id}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
                {loading ? 'Saving...' : 'Save Languages'}
            </button>
        </div>
    );
}
