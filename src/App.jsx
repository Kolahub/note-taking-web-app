// import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedLayout from './pages/ProtectedLayout';
// import supabase from './config/SupabaseConfig';
import AuthPages from './pages/AuthPages';
import { ThemeProvider } from './context/theme/ThemeProvider';
import { FontProvider } from './context/font/fontContext';

function App() {
  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const {
  //         data: { session },
  //         error,
  //       } = await supabase.auth.getSession();
  //       if (error) throw error;
  //       console.log('Initial session:', session ? 'Authenticated' : 'No session');
  //     } catch (error) {
  //       console.error('Session check error:', error.message);
  //     }
  //   };

  //   checkSession();

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     console.log('Auth state changed:', event, session);
  //   });

  //   return () => subscription?.unsubscribe();
  // }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'all-notes', element: <Dashboard /> },
        { path: 'archive-notes', element: <Dashboard /> },
      ],
    },
    {
      path: '/auth',
      element: <Outlet />,
      children: [
        {
          path: 'reset',
          element: <AuthPages mode="reset" />,
        },
        {
          path: ':mode',
          element: <AuthPages />,
        },
        {
          index: true,
          element: <Navigate to="/auth/login" replace />,
        },
      ],
    },
    {
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
