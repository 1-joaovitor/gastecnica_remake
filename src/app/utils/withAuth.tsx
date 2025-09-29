// utils/withAuth.tsx
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

export function withAuth(Component:any) {
  return function AuthenticatedComponent(props : any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>; 
    }

    return <Component {...props} />;
  };
}
