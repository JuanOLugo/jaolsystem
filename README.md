# JAOL System

JAOL System es una aplicación de gestión de inventario y facturación diseñada para pequeños y medianos negocios. Este sistema permite administrar productos, generar facturas y controlar ventas de manera eficiente.

## 📦 Características Principales

- **Gestión de Inventario**: Agrega, edita y elimina productos (CRUD completo)
- **Facturación**: Crea y administra facturas con múltiples métodos de pago
- **Reportes y Análisis**: Visualización de ventas mediante gráficos interactivos
- **Autenticación Segura**: Manejo de usuarios con JWT y encriptación de contraseñas
- **Interfaz Moderna**: Desarrollada con React y TailwindCSS para una experiencia rápida y fluida
- **Navegación Amigable**: Interfaz responsiva para todo tipo de dispositivos

## 🚀 Tecnologías Utilizadas

### **Frontend (Cliente)**
- [React](https://reactjs.org/) con [TypeScript](https://www.typescriptlang.org/) y [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/) para estilos
- [Axios](https://axios-http.com/) para peticiones HTTP
- [Chart.js](https://www.chartjs.org/) y [react-chartjs-2](https://react-chartjs-2.js.org/) para visualización de datos
- [React Router](https://reactrouter.com/) para navegación

### **Backend (Servidor)**
- [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) para autenticación
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) para encriptación de contraseñas
- [Passport](http://www.passportjs.org/) y [CORS](https://www.npmjs.com/package/cors)

## 📂 Estructura del Proyecto

```
JAOL.app/
├── client/                 # Frontend del sistema
│   ├── index.html          # Documento raíz HTML
│   ├── package.json        # Dependencias del frontend
│   ├── vite.config.ts      # Configuración de Vite
│   ├── public/             # Recursos estáticos
│   └── src/                # Código fuente principal
│       ├── assets/         # Imágenes y recursos estáticos
│       ├── components/     # Componentes reutilizables
│       ├── pages/          # Vistas principales de la app
│       ├── services/       # Conexión a APIs
│       ├── App.tsx         # Componente principal
│       └── main.tsx        # Punto de entrada
│
├── server/                 # Backend
│   ├── src/                # Código fuente de Express
│   ├── public/             # Archivos públicos
│   ├── package.json        # Dependencias del backend
│   └── docker-compose.yml  # Configuración de Docker
```

## 🛠️ Instalación y Configuración

### **Requisitos Previos**
- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) en ejecución
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) instalado (opcional, para despliegue)

### **Pasos de Instalación**

1. Clonar el repositorio:
   ```sh
   git clone https://github.com/JuanOLugo/jaolsystem.git
   cd jaolsystem
   ```

2. Instalar dependencias en el cliente:
   ```sh
   cd client
   npm install
   ```

3. Instalar dependencias en el servidor:
   ```sh
   cd ../server
   npm install
   ```

4. Configurar variables de entorno:
   - Crear un archivo `.env` en `server/` con las siguientes variables:
     ```env
     MONGO_URI=tu_conexion_mongodb
     JWT_SECRET=clave_secreta
     ```

5. Iniciar la aplicación:
   ```sh
   # En una terminal, iniciar el servidor
   cd server
   npm start
   
   # En otra terminal, iniciar el cliente
   cd client
   npm run dev
   ```

6. Acceder a la aplicación en `http://localhost:5173`

### **Ejecutar con Docker** (opcional):
```sh
docker-compose up --build
```

## 📜 Scripts disponibles

| Comando           | Descripción                                |
|-------------------|--------------------------------------------|
| `npm run dev`     | Levanta el servidor de desarrollo          |
| `npm run build`   | Compila la app para producción             |
| `npm run preview` | Previsualiza la app compilada              |

## 🌐 Despliegue

Puedes desplegar esta aplicación en servicios como:

- Vercel
- Netlify
- Firebase Hosting

## 🔐 Seguridad

- Encriptación de contraseñas con bcrypt
- Uso de tokens JWT para autenticación segura
- Validación de formularios

## 🧪 Pruebas

Las pruebas unitarias y de integración pueden ser implementadas usando herramientas como:

- Jest
- React Testing Library

(Actualmente no se incluye cobertura de pruebas en esta versión.)

## 📢 Contribuciones

Si deseas contribuir, por favor abre un **issue** o envía un **pull request** con mejoras y sugerencias.

## 🧑‍💻 Autor

- **Juan Ojeda**
- [juanandresojeda77@gmail.com](mailto:juanandresojeda77@gmail.com)

## 📂 Repositorio

[https://github.com/JuanOLugo/jaolsystem](https://github.com/JuanOLugo/jaolsystem)

## ⚖️ Licencia

Este proyecto está bajo la licencia **MIT**. ¡Úsalo libremente! 🚀