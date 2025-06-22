'use client';

import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';


export default function ProfilePage() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [allLanguages, setAllLanguages] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/languages')
            .then(res => res.json())
            .then(data => setAllLanguages(data))
            .catch(err => console.error('Failed to load languages', err));
    }, []);


    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => setMessage(''), 3000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    if (!user) {
        return <div className="p-4 text-red-500">You are not logged in.</div>;
    }
    const getLangName = (id) => allLanguages.find(lang => lang.id === id)?.name || 'Unknown';


    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p><strong>Name:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Languages:</strong></p>
            <li>
                Native: {
                user.languages?.filter(l => l.type === 'native')
                    .map(l => getLangName(l.language_id))
                    .join(', ') || 'Not set'
            }
            </li>
            <li>
                Target: {
                user.languages?.filter(l => l.type === 'target')
                    .map(l => getLangName(l.language_id))
                    .join(', ') || 'Not set'
            }
            </li>



            <LanguageSelector user={user} setMessage={setMessage} dispatch={dispatch}/>

            {message && <p className="mt-4 text-green-600">{message}</p>}
            <LogoutButton/>
            <Link href="/search">
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Go to Search
                </button>
            </Link>

            <div className="mt-6 flex flex-col space-y-3">
                <Link href="/incoming">
                    <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                        Incoming Requests
                    </button>
                </Link>
                <Link href="/outgoing">
                    <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                        Outgoing Requests
                    </button>
                </Link>
                <Link href="/matches">
                    <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                        Matches
                    </button>
                </Link>
            </div>
        </div>
    );
}
