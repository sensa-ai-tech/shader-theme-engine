import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#050510',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 700 }}>404</h1>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>Page not found</p>
        <Link
          href="/"
          style={{
            background: '#7c3aed',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
