# JAOL System

JAOL System es una aplicación de gestión de inventario y facturación diseñada para pequeños y medianos negocios. Este sistema permite administrar productos, generar facturas y controlar ventas de manera eficiente.

## Características Principales
- 📦 **Gestión de Inventario**: Agrega, edita y elimina productos.
- 🧾 **Facturación**: Crea y administra facturas con múltiples métodos de pago.
- 📊 **Reportes y Análisis**: Visualización de ventas mediante gráficos interactivos.
- 🔐 **Autenticación Segura**: Manejo de usuarios con JWT y encriptación de contraseñas.
- 🌐 **Interfaz Moderna**: Desarrollada con React y TailwindCSS para una experiencia rápida y fluida.

---

## 🚀 Tecnologías Utilizadas

### **Frontend (Cliente)**
- [React](https://reactjs.org/) con [Vite](https://vitejs.dev/)
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

---

## 📂 Estructura del Proyecto

```
JAOL.app/
├── client/      # Frontend
│   ├── src/     # Código fuente de React
│   ├── public/  # Recursos estáticos
│   ├── package.json
│   └── vite.config.ts
│
├── server/      # Backend
│   ├── src/     # Código fuente de Express
│   ├── public/  # Archivos públicos
│   ├── package.json
│   └── docker-compose.yml
```

---

## 🛠️ Instalación y Configuración

### **Requisitos Previos**
- [Node.js](https://nodejs.org/) instalado
- [MongoDB](https://www.mongodb.com/) en ejecución

### **Pasos de Instalación**
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/JuanOLugo/jaolsystem.git
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

---

## 📢 Contribuciones

Si deseas contribuir, por favor abre un **issue** o envía un **pull request** con mejoras y sugerencias.

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. ¡Úsalo libremente! 🚀

