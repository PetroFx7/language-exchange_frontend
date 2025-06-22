// components/Loader.jsx
import React from 'react';

export default function Loader() {
    return (
        <div className="relative w-12 h-12">
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute top-0 left-0 w-full h-full animate-pulseDot`}
                    style={{
                        transform: `rotate(${i * 45}deg)`,
                        animationDelay: `${-0.125 * (8 - i)}s`,
                    }}
                >
                    <div className="w-[20%] h-[20%] bg-blue-800 rounded-full mx-auto shadow-lg opacity-50" />
                </div>
            ))}
        </div>
    );
}
