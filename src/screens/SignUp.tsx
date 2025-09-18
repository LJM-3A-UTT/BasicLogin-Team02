// src/screens/SignUp.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'expo-router';
// Dentro del componente SignIn
const router = useRouter();

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  confirm: Yup.string().oneOf([Yup.ref('password'), undefined], 'Las contraseñas no coinciden').required('Requerido'),
});

export default function SignUp({ navigation }: any) {
  const { signUpWithEmail } = useAuth();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Regístrate</Text>
        <Formik
          initialValues={{ email: '', password: '', confirm: '' }}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await signUpWithEmail(values.email, values.password, 'supabase');
            } catch (err: any) {
              setErrors({ password: err.message || 'Error' });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <>
              <TextInput placeholder="Correo" style={styles.input} keyboardType="email-address" autoCapitalize="none" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
              {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

              <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
              {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

              <TextInput placeholder="Confirmar contraseña" style={styles.input} secureTextEntry onChangeText={handleChange('confirm')} onBlur={handleBlur('confirm')} value={values.confirm} />
              {errors.confirm && touched.confirm && <Text style={styles.error}>{errors.confirm}</Text>}

              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} disabled={isSubmitting}>
                <Text style={styles.buttonText}>Crear cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/sign-in')}>
                <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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
