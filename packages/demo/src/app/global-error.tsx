'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
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
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>{error.message}</p>
          <button
            onClick={reset}
            style={{
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.625rem 1.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
