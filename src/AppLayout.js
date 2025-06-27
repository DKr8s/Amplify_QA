import AppNavbar from './AppNavbar';
import { Outlet } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function AppLayout() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <div>
      <AppNavbar user={user} signOut={signOut} />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
