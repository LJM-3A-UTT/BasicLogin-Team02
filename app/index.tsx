// app/index.tsx
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Siempre redirige al login al abrir la app
  return <Redirect href="/sign-in" />;
}
