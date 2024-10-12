"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Make API call to the backend to verify the token
      const res = await fetch('http://localhost:3001/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setLoading(false);
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    verifyToken();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <p>Welcome, {user.username}</p>
      <p>You are successfully logged in.</p>
    </div>
  );
}

