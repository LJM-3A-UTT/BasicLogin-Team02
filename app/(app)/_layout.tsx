// app/(app)/_layout.tsx
import React from 'react';
import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    // Puedes mostrar splash o null mientras carga
    return null;
  }

  if (!user) {
    // Si no hay usuario, manda al login
    return <Redirect href="/sign-in" />;
  }

  // Si sí hay usuario, renderiza las pantallas protegidas
  return <Slot />;
}
