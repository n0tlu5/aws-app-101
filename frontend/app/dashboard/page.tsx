"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import config from '../utils/config';
import { User } from '../types/user';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Make API call to the backend to verify the token
      const res = await fetch(`${config.backendUrl}/profile`, {
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


  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Welcome, {user!.username}</p>
      <p>You are successfully logged in.</p>
    </div>
  );
}

