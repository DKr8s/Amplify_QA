import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const { user, route } = useAuthenticator((context) => [context.user, context.route]);

  // 👉 route === 'authenticated' thì mới login thực sự
  const isAuthenticated = route === 'authenticated';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const groups = user?.signInUserSession?.accessToken?.payload?.['cognito:groups'] || [];
  const isAdmin = groups.includes('Admin');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
