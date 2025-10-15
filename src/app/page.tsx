'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/menu');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, hsl(215 28% 8%) 0%, hsl(220 26% 6%) 100%)'
    }}>
      <div className="text-center">
        <div className="text-6xl font-bold mb-4" style={{
          color: '#ffff00',
          textShadow: '0 0 30px rgba(255, 255, 0, 0.6)',
          fontWeight: 900,
        }}>
          PAC-MAN
        </div>
        <div className="text-white/60">Loading...</div>
      </div>
    </div>
  );
}