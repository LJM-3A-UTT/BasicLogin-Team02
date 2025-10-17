// src/screens/SignUp.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';

// ✅ Esquema Yup para validación
const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Ingresa un correo válido')
    .required('El correo es obligatorio'),
  password: Yup.string()
    .trim()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal

  // Si ya hay JWT → redirigir a Home
  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      let token: string | null = null;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('jwt');
      } else {
        token = await SecureStore.getItemAsync('jwt');
      }

      if (token) {
        setTimeout(() => router.replace('/home'), 0); // Espera a que la pantalla se monte
      }
    };

    redirectIfLoggedIn();
  }, []);

  const handleRegister = async (values: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      const { email, password } = values;

      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 🔹 Caso 1: usuario ya confirmado y JWT disponible
        if (data.token) {
          if (Platform.OS === 'web') {
            localStorage.setItem('jwt', data.token);
          } else {
            await SecureStore.setItemAsync('jwt', data.token);
          }
          router.replace('/home');
        } else {
          // 🔹 Caso 2: usuario necesita confirmar correo
          alert(
            data.msg ||
              'Se ha enviado un correo de confirmación. Revisa tu email antes de iniciar sesión.'
          );
        }
      } else {
        // 🔹 Error de validación o correo duplicado
        alert(data.msg || 'Inicie sesión correo ya registrado');
      }
    } catch (err) {
      console.error('❌ Error de conexión o fetch:', err);
      alert('Error de conexión');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Regístrate</Text>

        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={SignUpSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Email */}
              <TextInput
                placeholder="Correo"
                style={styles.input}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              {/* Password */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Contraseña"
                  style={styles.inputField}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              {/* Confirm Password */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Confirmar contraseña"
                  style={styles.inputField}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit as any}>
                <Text style={styles.buttonText}>Crear cuenta</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <TouchableOpacity onPress={() => router.push('/sign-in')}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>

        {/* Enlace al Aviso de Privacidad que abre el modal */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.link}>Aviso de privacidad</Text>
        </TouchableOpacity>
      </View>

      {/* Modal del Aviso de Privacidad */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aviso de Privacidad</Text>
            <ScrollView style={styles.scrollContent}>
              <Text style={styles.text}>
                En ClinicApp, nos comprometemos a proteger tu privacidad. Este aviso de privacidad describe
                cómo recopilamos, utilizamos y protegemos tu información personal. Al utilizar nuestra aplicación, aceptas las
                prácticas descritas en este aviso.
              </Text>
              <Text style={styles.text}>
                1. Información que Recopilamos: Recopilamos información personal como tu correo electrónico y datos de uso de la
                aplicación.
              </Text>
              <Text style={styles.text}>
                2. Uso de la Información: Usamos la información para proporcionarte nuestros servicios y mantener tu cuenta.
              </Text>
              <Text style={styles.text}>
                3. Protección de la Información: Implementamos medidas de seguridad para proteger tus datos.
              </Text>
              <Text style={styles.text}>
                4. Compartir Información: No compartimos tu información sin tu consentimiento, excepto cuando sea necesario por
                razones legales.
              </Text>
              <Text style={styles.text}>
                5. Cambios al Aviso: Nos reservamos el derecho de modificar este aviso. Cualquier cambio será publicado aquí.
              </Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1DA1F2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#1DA1F2',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxHeight: '80%', // Máxima altura
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'left',
  },
  scrollContent: {
    maxHeight: '70%',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#1DA1F2',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
});

