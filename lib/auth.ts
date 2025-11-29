// lib/auth.ts
export function validateAuth(password: string): boolean {
  const expectedPassword = process.env.ACCESS_PASSWORD || 'SYNTX2025'
  return password === expectedPassword
}

// In components/syntx/auth-gate.tsx verwenden