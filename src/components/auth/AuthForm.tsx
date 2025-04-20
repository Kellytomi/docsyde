'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function AuthForm() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4 strength
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, isNewUser, setIsNewUser } = useAuth();
  const router = useRouter();

  // Check URL parameters on component mount
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains number
    if (/\d/.test(password)) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  // Check password match when confirm password changes
  useEffect(() => {
    if (isSignUp && confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (passwordStrength < 3) {
        setError('Please use a stronger password');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        router.push('/onboarding');
      } else {
        await signIn(email, password);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      
      // Redirect based on whether this is a new user
      if (isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred with Google sign-in');
      setGoogleLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (!password) return '';
    const texts = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength] || '';
  };

  const getPasswordStrengthColor = () => {
    if (!password) return '#e5e7eb';
    const colors = ['#ef4444', '#f59e0b', '#facc15', '#65a30d', '#10b981'];
    return colors[passwordStrength] || '';
  };

  return (
    <div className="auth-container">
      {/* Left Side - Form */}
      <div className="auth-form-container">
        <div className="auth-form-content">
          <Link href="/" className="auth-logo">Docsyde</Link>
          <h2 className="auth-title">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="auth-subtitle">
            {isSignUp ? 'Start collaborating on documents' : 'Access your documents and workspaces'}
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="form-input"
                placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              {isSignUp && password && (
                <div className="password-strength" style={{ marginTop: '0.5rem' }}>
                  <div className="strength-bars" style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div 
                        key={level}
                        style={{
                          height: '4px',
                          flex: 1,
                          backgroundColor: level <= passwordStrength ? getPasswordStrengthColor() : '#e5e7eb',
                          borderRadius: '2px',
                          transition: 'background-color 0.2s'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: getPasswordStrengthColor(),
                    transition: 'color 0.2s'
                  }}>
                    {getPasswordStrengthText()}
                  </div>
                </div>
              )}
              
              {isSignUp && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  Password should have at least 8 characters with uppercase, lowercase, number, and special character.
                </div>
              )}
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError && (
                  <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    {passwordError}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignUp && (passwordStrength < 3 || password !== confirmPassword))}
              className="form-submit"
            >
              {loading ? (
                <div className="loading-indicator">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </span>
                </div>
              ) : (
                <span>{isSignUp ? 'Sign up' : 'Sign in'}</span>
              )}
            </button>

            <div className="form-divider">
              <span className="form-divider-text">Or</span>
            </div>

            <button
              type="button"
              className="form-alternate"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: googleLoading ? 'not-allowed' : 'pointer',
                opacity: googleLoading ? 0.7 : 1,
              }}
            >
              {googleLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
                  <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
                  <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
                  <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
                </svg>
              )}
              <span>
                {googleLoading 
                  ? 'Signing in with Google...'
                  : `${isSignUp ? 'Sign up' : 'Sign in'} with Google`
                }
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setPasswordError('');
                setError('');
                setConfirmPassword('');
              }}
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--primary)',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginTop: '1.5rem',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="auth-info-container">
        <div className="auth-info-content">
          <div className="auth-info-inner">
            <h2 className="auth-info-title">
              Streamline Your Document Collaboration
            </h2>
            <p className="auth-info-subtitle">
              DocSyde makes it easy to create, share, and collaborate on documents in real-time.
            </p>
            <div className="auth-info-features">
              <div className="auth-feature">
                <div className="auth-feature-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span className="auth-feature-text">Real-time collaboration with your team</span>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <span className="auth-feature-text">Secure document storage</span>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="auth-feature-text">Version history and document tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 