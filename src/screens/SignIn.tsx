// src/screens/SignIn.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'expo-router';
// Dentro del componente SignIn
const router = useRouter();

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
});

export default function SignIn({ navigation }: any) {
  const { signInWithEmail } = useAuth();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Inicia sesión</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              // Cambia 'supabase'|'firebase' según tu preferencia
              await signInWithEmail(values.email, values.password, 'supabase');
            } catch (err: any) {
              setErrors({ password: err.message || 'Error' });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <>
              <TextInput
                placeholder="Correo"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

              <TextInput
                placeholder="Contraseña"
                style={styles.input}
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} disabled={isSubmitting}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>

<TouchableOpacity onPress={() => router.push('/sign-up')}>
  <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
</TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#fff', padding: 24, borderRadius: 12, elevation: 3 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
  button: { backgroundColor: '#1DA1F2', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 12, color: '#555' },
  error: { color: 'red', fontSize: 12, marginBottom: 8 },
});
