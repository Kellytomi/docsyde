'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import Link from 'next/link';

export default function OnboardingPage() {
  const { user, userProfile, updateUserProfile, loading } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // If already completed onboarding, redirect to dashboard
    if (!loading && userProfile?.onboardingCompleted) {
      router.push('/dashboard');
    }
    
    // Pre-fill form with existing data if available
    if (userProfile) {
      if (userProfile.firstName) setFirstName(userProfile.firstName);
      if (userProfile.lastName) setLastName(userProfile.lastName);
      if (userProfile.jobTitle) setJobTitle(userProfile.jobTitle);
      if (userProfile.organization) setOrganization(userProfile.organization);
    }
    
    // Pre-fill from user's Google account if available
    if (user?.displayName && !firstName && !lastName) {
      const nameParts = user.displayName.split(' ');
      if (nameParts.length > 0) {
        setFirstName(nameParts[0]);
        if (nameParts.length > 1) {
          setLastName(nameParts.slice(1).join(' '));
        }
      }
    }
  }, [user, userProfile, loading, router, firstName, lastName]);

  // Redirect to login if no user
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        jobTitle: jobTitle.trim(),
        organization: organization.trim(),
        onboardingCompleted: true,
      });
      
      // Show loading state before redirecting to improve UX
      setIsRedirecting(true);
      // Prefetch dashboard to reduce loading time
      router.prefetch('/dashboard');
      
      // Small delay to ensure the profile update is processed
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
      
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
      setIsSubmitting(false);
      setIsRedirecting(false);
    }
  };

  if (loading || isRedirecting) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #eef2ff, #ffffff)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <svg style={{
            width: '3rem',
            height: '3rem',
            color: '#4f46e5',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
            marginBottom: '1rem'
          }} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p style={{ fontWeight: '500', color: '#4b5563' }}>
            {isRedirecting ? 'Preparing your dashboard...' : 'Loading your profile...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <Link href="/" style={{ color: '#4f46e5', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
            </svg>
            DocSyde
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          background: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>
          {/* Progress steps */}
          <div style={{
            background: 'linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%)',
            color: 'white',
            padding: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Set Up Your Account</h2>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Step 2 of 3</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'white',
                color: '#4f46e5',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
                ✓
              </div>
              
              <div style={{
                flex: 1,
                height: '2px',
                background: 'rgba(255, 255, 255, 0.5)',
                margin: '0 0.5rem',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '100%',
                  background: 'white'
                }}></div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'white',
                color: '#4f46e5',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
                2
              </div>
              
              <div style={{
                flex: 1,
                height: '2px',
                background: 'rgba(255, 255, 255, 0.5)',
                margin: '0 0.5rem'
              }}></div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
                3
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <div style={{ width: '2rem', textAlign: 'center' }}>Account</div>
              <div style={{ flex: 1 }}></div>
              <div style={{ width: '2rem', textAlign: 'center' }}>Profile</div>
              <div style={{ flex: 1 }}></div>
              <div style={{ width: '2rem', textAlign: 'center' }}>Dashboard</div>
            </div>
          </div>
          
          {/* Form content */}
          <div style={{ padding: '2rem' }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              Complete Your Profile
            </h1>
            
            <p style={{ 
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              Tell us a bit about yourself to get started with DocSyde
            </p>
            
            {error && (
              <div style={{
                backgroundColor: '#FEF2F2',
                borderLeft: '4px solid #EF4444',
                color: '#B91C1C',
                padding: '1rem',
                borderRadius: '0.375rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <span style={{ fontWeight: 'medium' }}>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(2, 1fr)', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label htmlFor="firstName" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    First Name<span style={{ color: '#EF4444', marginLeft: '0.25rem' }}>*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #D1D5DB',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      fontSize: '0.875rem'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #D1D5DB',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="jobTitle" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Job Title
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    left: '0.75rem',
                    color: '#9CA3AF'
                  }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Product Manager, Developer, etc."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingLeft: '2.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #D1D5DB',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="organization" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Organization
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    left: '0.75rem',
                    color: '#9CA3AF'
                  }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company name or organization"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingLeft: '2.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #D1D5DB',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(to right, #4f46e5, #3b82f6)',
                  color: 'white',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  border: 'none',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  transition: 'all 150ms ease'
                }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ 
                      width: '1.25rem', 
                      height: '1.25rem',
                      marginRight: '0.5rem',
                      animation: 'spin 1s linear infinite'
                    }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Completing Setup...
                  </span>
                ) : 'Complete Setup and Continue'}
              </button>
              
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6B7280', 
                textAlign: 'center' 
              }}>
                You can always update your profile later from dashboard settings.
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <footer style={{
        padding: '1.5rem',
        color: '#6B7280',
        fontSize: '0.75rem',
        textAlign: 'center',
        borderTop: '1px solid #E5E7EB'
      }}>
        © {new Date().getFullYear()} DocSyde. All rights reserved.
      </footer>
    </div>
  );
} 