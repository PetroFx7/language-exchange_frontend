'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-4 border-b border-gray-200 bg-white px-4 py-10 text-center sm:px-16">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome to Language Exchange</h1>
                    <p className="text-sm text-gray-500">Choose an option below to continue</p>

                    <div className="flex w-full flex-col space-y-3">
                        <Link href="/register">
                            <button className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800">
                                Register
                            </button>
                        </Link>
                        <Link href="/login">
                            <button className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100">
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
