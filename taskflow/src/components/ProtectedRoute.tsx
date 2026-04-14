import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../store';

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}