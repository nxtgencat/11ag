import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from '../pages/auth/AuthPage';
import { ChatsPage } from '../pages/chats/ChatsPage';

export const AppRoutes: React.FC = () => {
  const { authStep } = useAuth();

  if (authStep !== 'authenticated') {
    return <AuthPage />;
  }

  return <ChatsPage />;
};
