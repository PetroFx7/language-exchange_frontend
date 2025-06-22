'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { full_name, email, password, confirmPassword } = formData;

        if (!full_name || !email || !password || !confirmPassword) {
            return setError('All fields are required.');
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return setError('Invalid email format.');
        }

        if (password.length < 8) {
            return setError('Password must be at least 6 characters.');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        try {
            const res = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registration failed.');
            } else {
                setSuccess('Registered successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError('Server error.');
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">Sign Up</h3>
                    <p className="text-sm text-gray-500">Create a new account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white px-4 py-6 sm:px-16">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="mb-4 w-full rounded border px-4 py-2"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mb-4 w-full rounded border px-4 py-2"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mb-4 w-full rounded border px-4 py-2"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="mb-6 w-full rounded border px-4 py-2"
                    />

                    <button
                        type="submit"
                        className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
                    >
                        Register
                    </button>

                    {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
                    {success && <p className="mt-4 text-center text-sm text-green-600">{success}</p>}

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-gray-800">
                            Sign in
                        </Link>
                        .
                    </p>
                </form>
            </div>
        </div>
    );
}
