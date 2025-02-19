// App.jsx
import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedLayout from './components/ProtectedLayout';
import supabase from './config/SupabaseConfig';
import AuthPages from './pages/AuthPages';
import { ThemeProvider } from './context/theme/ThemeProvider';
import { FontProvider } from './context/font/fontContext';
// import { FontProvider } from './context/font/fontContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session on mount
    const checkUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error('No active session:', sessionError?.message);
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        setUser(null);
      } else {
        setUser(userData.user);
      }
      setLoading(false);
    };

    // Listen for auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    checkUser();

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    // Optionally show a loading state while checking auth status
    return <div>Loading... 😍</div>;
  }

  // Create a router configuration with protected and public routes
  const router = createBrowserRouter([
    {
      // Protected routes (only accessible if authenticated)
      path: '/',
      element: <ProtectedLayout user={user} />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'all-notes', element: <Dashboard /> },
        { path: 'archive-notes', element: <Dashboard /> },
      ],
    },
    {
      // Public authentication routes
      path: '/auth',
      element: user ? <Navigate to="/" replace /> : <Outlet />,
      children: [
        // Default to login if no mode is provided
        { index: true, element: <Navigate to="/auth/login" replace /> },
        { path: ':mode', element: <AuthPages /> },
      ],
    },
    {
      // Redirect any unknown paths to the authentication login page
      path: '*',
      element: <Navigate to="/auth/login" replace />,
    },
  ]);

  return (
    <ThemeProvider>
      <FontProvider>
        <RouterProvider router={router} />
      </FontProvider>
    </ThemeProvider>
  );
}

export default App;
