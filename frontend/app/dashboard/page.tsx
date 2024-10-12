"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // TODO: stitch to backend
      // Make API call to the backend to verify the token
      const res = await fetch('/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Send token in Authorization header
        },
      });

      // TODO: remove debug
      if (true) {
      //if (res.ok) {
        setLoading(false);  // If token is valid, allow user to view the dashboard
      } else {
        localStorage.removeItem('token');  // Remove invalid token
        router.push('/login');  // Redirect to login if verification fails
      }
    };

    verifyToken();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>You are successfully logged in.</p>
    </div>
  );
}

