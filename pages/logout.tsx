import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear local storage and session storage
    localStorage.clear();
    sessionStorage.clear();

    // Sign out from NextAuth and redirect to the home page
    signOut({ redirect: false }).then(() => {
      router.push('/');
    });
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Logging out...</p>
    </div>
  );
}