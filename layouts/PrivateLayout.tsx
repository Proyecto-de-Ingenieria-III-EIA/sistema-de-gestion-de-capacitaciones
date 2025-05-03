import { SidebarProvider } from '@/components/ui/sidebar';
import { signIn, useSession } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    signIn('auth0');
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <main className='flex-1 overflow-auto'>
        <div className='container'>{children}</div>
        <Toaster />
      </main>
    </SidebarProvider>
  );
};

export { PrivateLayout };
