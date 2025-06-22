'use client';

import { useDispatch, useSelector } from 'react-redux';
import { sendRequest, cancelRequest } from '@/store/requestsSlice';

export default function UserCard({ user }) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user?.token);
    const sent = useSelector((state) => state.requests.sent);

    const isRequested = sent.includes(user.id);

    const handleRequest = async () => {
        try {
            const res = await fetch('http://localhost:5000/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ to_user_id: user.id }),
            });

            if (res.ok) {
                dispatch(sendRequest(user.id));
            }
        } catch (err) {
            console.error('Send error', err);
        }
    };

    const handleCancel = async () => {
        try {
            const res = await fetch(`http://localhost:5000/requests/${user.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                dispatch(cancelRequest(user.id));
            }
        } catch (err) {
            console.error('Cancel error', err);
        }
    };

    return (
        <div className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-sm">
                    Native: {user.nativeLanguages?.join(', ')}
                </p>
                <p className="text-sm">
                    Target: {user.targetLanguages?.join(', ')}
                </p>
            </div>
            <button
                onClick={isRequested ? handleCancel : handleRequest}
                className={`px-4 py-2 rounded ${
                    isRequested ? 'bg-gray-300' : 'bg-blue-600 text-white'
                }`}
            >
                {isRequested ? 'Cancel Request' : 'Send Request'}
            </button>
        </div>
    );
}
