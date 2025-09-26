# Clinic App Frontend 📱

Aplicación móvil desarrollada con **React Native (Expo)** para la gestión de citas médicas.  
Incluye autenticación segura con JWT y muestra imágenes curiosas de la **API de la NASA** 🚀.

---

## 🚀 Instalación y ejecución

Requisitos: **Node 22.19.0** y **Expo CLI** instalado globalmente.

1. Clonar repositorio:
```bash
git clone https://github.com/tu-usuario/clinic-app-frontend.git
cd clinic-app-frontend
Instalar dependencias:
npm install
Iniciar la app:
npx expo start
Podrás abrir la aplicación en:
Expo Go (dispositivo móvil escaneando QR)
Emulador Android
Simulador iOS
Web desde navegador


📦 Dependencias principales
expo-router → navegación
expo-secure-store → almacenamiento seguro de JWT en móvil
localStorage → almacenamiento seguro de JWT en web
formik → manejo de formularios
yup → validación de formularios
react-native-vector-icons → íconos
@react-native-community/datetimepicker → selector de fechas

🔑 Flujo de autenticación
El usuario se registra o inicia sesión.
El backend responde con un token JWT.
El token se guarda en:
SecureStore si es móvil
localStorage si es web
Todas las peticiones protegidas incluyen este token en el header:
Authorization: Bearer <token>

🗂️ Funcionalidades principales
Registro e inicio de sesión de usuarios.
Creación, listado, edición y eliminación de citas.
Visualización de imágenes y curiosidades de la NASA en el listado de citas.
Validación de formularios con mensajes de error claros.
UI optimizada para usuarios con poca experiencia tecnológica.

⚙️ Integración con API de la NASA
Cada cita muestra una curiosidad y una imagen obtenida desde la NASA:
https://api.nasa.gov/planetary/apod?api_key=TU_API_KEY
Ejemplo de consumo en frontend:
const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=TU_API_KEY');
const data = await res.json();
const citaConNasa = {
  ...formData,
  nasa: { url: data.url, title: data.title, curiosidad: data.explanation }


🔒 Seguridad aplicada en frontend
JWT para autenticar solicitudes.
SecureStore y localStorage para guardar tokens de forma segura.
Validación de formularios con Yup.
Prevención de fuga de tokens nunca expuestos en código ni repositorios.
Uso de variables de entorno para configurar API Keys.