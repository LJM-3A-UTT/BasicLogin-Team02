// app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/providers/AuthProvider';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Redirect href="./app/(app)/home" />;
  } else {
    return <Redirect href="/sign-in" />;
  }
}
