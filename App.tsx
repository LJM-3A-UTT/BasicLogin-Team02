// App.tsx
import React from 'react';
import { AuthProvider } from './src/providers/AuthProvider';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
