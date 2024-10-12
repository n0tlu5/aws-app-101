"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // TODO: stitch to backend
    // Make API call to the backend authentication service
    const res = await fetch('/', {
      method: 'GET',
      //headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify({ username, password }),
    });

    console.log(res)

    if (true) {
    // TODO: remove debug
    //if (res.ok) {
      //const { token } = await res.json();
      const token = "test";
      localStorage.setItem('token', token);  // Store token in localStorage
      router.push('/dashboard');  // Redirect to dashboard after login
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="card w-96 bg-base-100 shadow-xl p-5" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="form-control mb-4">
          <label className="label">Username</label>
          <input
            type="text"
            className="input input-bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Password</label>
          <input
            type="password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full">Login</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}

