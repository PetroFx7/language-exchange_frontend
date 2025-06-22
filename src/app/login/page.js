'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice'; // переконайся, що шлях правильний

export default function SignInPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed');
            } else {
                // ⬇️ Зберегти токен у localStorage
                localStorage.setItem('token', data.token);

                // ⬇️ Зберегти профіль користувача у Redux
                dispatch(setUser({
                    token: data.token,
                    id: data.profile.id,
                    email: data.profile.email,
                    full_name: data.profile.full_name,
                }));

                // ⬇️ Перенаправлення
                router.push('/profile'); // або '/search'
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">Sign In</h3>
                    <p className="text-sm text-gray-500">
                        Use your email and password to sign in
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white px-4 py-6 sm:px-16">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mb-4 w-full rounded border px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mb-6 w-full rounded border px-4 py-2"
                    />

                    {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
                    >
                        Sign in
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-semibold text-gray-800">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
