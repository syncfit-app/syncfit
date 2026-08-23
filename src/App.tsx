import React from 'react';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Navbar Header */}
      <header style={{ backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #FF5E00 0%, #FF006B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 'bold' }}>
            SF
          </div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#0F172A' }}>SyncFit</h1>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(255, 94, 0, 0.1)', color: '#FF5E00' }}>
          100% Gratis & Unlocked
        </span>
      </header>

      {/* Hero Welcome Card */}
      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0px 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>
            Selamat Datang di SyncFit! 🔥
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>
            Sistem kebugaran deterministik & pelacak aktivitas outdoor siap digunakan.
          </p>
          <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #FF5E00 0%, #FF006B 100%)', color: '#FFFFFF', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            Mulai Program Latihan
          </button>
        </div>
      </main>
    </div>
  );
}
