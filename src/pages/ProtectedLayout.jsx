import { Navigate, Outlet } from 'react-router-dom';
import supabase from '../config/SupabaseConfig';
import { useEffect, useState } from 'react';

const ProtectedLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading your notes...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  return (
    <div className="flex flex-col h-screen">
      {/* Your layout content */}
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
