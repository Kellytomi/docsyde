'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

// Mock data for documents
const documents = [
  {
    id: '1',
    title: 'Project Proposal',
    createdAt: '2023-05-10',
    status: 'Draft',
    lastEdited: '1 day ago',
  },
  {
    id: '2',
    title: 'Meeting Notes',
    createdAt: '2023-05-08',
    status: 'Shared',
    lastEdited: '3 days ago',
  },
  {
    id: '3',
    title: 'Business Plan',
    createdAt: '2023-05-05',
    status: 'Draft',
    lastEdited: '1 week ago',
  },
  {
    id: '4',
    title: 'Marketing Strategy',
    createdAt: '2023-05-01',
    status: 'Shared',
    lastEdited: '2 weeks ago',
  },
];

// Create a cache to store dashboard data
let dashboardCache = {
  initialized: false,
  firstName: null as string | null,
  loading: true,
};

export default function Dashboard() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Use memo to efficiently derive firstName from user data
  const firstName = useMemo(() => {
    if (user?.displayName) {
      const nameParts = user.displayName.split(' ');
      return nameParts[0];
    }
    if (userProfile?.firstName) return userProfile.firstName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  }, [user?.displayName, user?.email, userProfile?.firstName]);

  // Dashboard loading optimization
  useEffect(() => {
    // If first load or returning to dashboard
    if (!dashboardCache.initialized || dashboardCache.loading) {
      // Short delay to avoid flash of loading state for quick loads
      const timer = setTimeout(() => {
        if (localLoading) {
          setLocalLoading(true);
        }
      }, 200);

      // Update cache when data is available
      if (!authLoading && user) {
        dashboardCache = {
          initialized: true,
          firstName: firstName,
          loading: false,
        };
        setLocalLoading(false);
      }

      return () => clearTimeout(timer);
    } else {
      // Use cached data if available
      setLocalLoading(false);
    }
  }, [authLoading, user, firstName, localLoading]);
  
  // Prefetch document pages for faster navigation
  useEffect(() => {
    // Prefetch document route
    router.prefetch('/dashboard/documents');
  }, [router]);
  
  // Early return to improve rendering speed
  if (authLoading || localLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading your dashboard...</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This will only take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        <div 
          className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div 
          className={`fixed bottom-0 top-0 z-30 w-64 overflow-y-auto border-r border-gray-200 bg-white p-4 transition-all duration-300 ease-in-out lg:static lg:left-0 lg:shadow-none ${isSidebarOpen ? 'left-0' : '-left-full'}`}
        >
          <div className="mb-4 flex items-center justify-center border-b border-gray-200 pb-4">
            <span className="text-xl font-bold text-indigo-600">DocSyde</span>
          </div>
          
          {/* Sidebar user info */}
          <div className="my-6 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="h-full w-full rounded-full object-cover" 
                />
              ) : (
                <span>
                  {user?.displayName 
                    ? `${user.displayName.split(' ')[0][0]}${user.displayName.split(' ')[1]?.[0] || ''}`
                    : user?.email?.charAt(0).toUpperCase() || 'U'
                  }
                </span>
              )}
            </div>
            <h4 className="mt-3 text-sm font-medium">
              {user?.displayName || user?.email || 'User'}
            </h4>
            <p className="text-xs text-gray-500">Premium Account</p>
          </div>
          
          <div className="mt-8">
            <h5 className="mb-3 pl-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Menu</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center rounded-lg bg-indigo-100 px-4 py-3 font-medium text-indigo-600">
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documents" className="flex items-center rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-100">
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                  <span>Documents</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/shared" className="flex items-center rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-100">
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                  </svg>
                  <span>Shared</span>
                </Link>
              </li>
            </ul>
            
            {/* Desktop Sidebar Footer */}
            <div className="mt-8 border-t border-gray-200 pt-4">
              <button 
                onClick={() => signOut()} 
                className="flex w-full items-center rounded-lg px-4 py-3 font-medium text-gray-600 hover:bg-gray-100"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z" fill="currentColor"/>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 lg:ml-64">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="flex items-center justify-center text-gray-500 lg:hidden"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
            
            <div>
              <Link href="/dashboard/documents/new" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                New Document
              </Link>
            </div>
          </header>
          
          <main className="p-6">
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                {getGreeting()}, {firstName}
              </h2>
              <p className="text-gray-600">Here's what's happening with your documents today.</p>
            </div>
            
            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-2xl font-bold text-gray-800">{documents.length}</h4>
                    <p className="mt-1 text-gray-500">Total Documents</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-2xl font-bold text-gray-800">2</h4>
                    <p className="mt-1 text-gray-500">Recent Edits</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-2xl font-bold text-gray-800">2</h4>
                    <p className="mt-1 text-gray-500">Shared Documents</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Documents list */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Documents</h3>
                <Link href="/dashboard/documents" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  View all
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Last Edited
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-gray-500">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-800">{doc.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {doc.createdAt}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            doc.status === 'Shared' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {doc.lastEdited}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                          <Link 
                            href={`/dashboard/documents/${doc.id}`}
                            className="mr-3 font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            Edit
                          </Link>
                          <Link 
                            href={`/dashboard/documents/${doc.id}/view`}
                            className="font-medium text-gray-600 hover:text-gray-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 