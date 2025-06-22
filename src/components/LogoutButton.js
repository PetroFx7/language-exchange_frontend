'use client';

import { useDispatch } from 'react-redux';
import { persistor } from '@/store/store';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await persistor.purge();
        dispatch({ type: 'user/logout' });
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded z-50"
        >
            Logout
        </button>
    );
}
