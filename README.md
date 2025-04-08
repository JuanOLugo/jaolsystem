
# JAOL System

JAOL System es una potente aplicación de gestión de inventario y facturación pensada para pequeños y medianos negocios. Permite administrar productos, controlar ventas y emitir facturas, todo desde una interfaz moderna y responsiva.

## 📦 Características Principales

- **Gestión de Inventario**: CRUD completo de productos
- **Facturación Inteligente**: Soporte para múltiples métodos de pago
- **Visualización de Datos**: Gráficas de ventas con Chart.js
- **Autenticación Segura**: Usuarios con JWT y contraseñas cifradas
- **UI Moderna**: Interfaz rápida con React y TailwindCSS
- **Pruebas Automatizadas**: Cobertura con Jest para asegurar la estabilidad del backend

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
│   ├── tests/              # Pruebas unitarias e integración
│   └── jest.config.js      # Configuración de Jest
│   ├── package.json        # Dependencias del backend
│   └── docker-compose.yml  # Configuración de Docker
```

## 🛠️ Instalación

### **Requisitos Previos**
- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) en ejecución
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) instalado (opcional, para despliegue)### **Requisitos Previos**
- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) en ejecución
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) instalado (opcional, para despliegue)


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

### Variables de entorno (`server/.env`)
```env
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=clave_secreta
```

### Ejecutar el Proyecto

```bash
# Backend
cd server
npm start

# Frontend
cd ../client
npm run dev
```

Abrir en: [http://localhost:5173](http://localhost:5173)

## 🧪 Pruebas con Jest

Se ha implementado un conjunto básico de pruebas en el backend usando Jest.

### Ejecutar pruebas

```bash
cd server
npm test
```

### Scripts disponibles

| Comando           | Descripción                                |
|-------------------|--------------------------------------------|
| `npm run dev`     | Levanta entorno de desarrollo (cliente)    |
| `npm start`       | Inicia el backend                          |
| `npm test`        | Ejecuta las pruebas con Jest               |
| `npm run build`   | Compila frontend para producción           |
| `npm run preview` | Previsualiza frontend en producción        |

## 🐳 Docker (opcional)

```bash
docker-compose up --build
```

## 🌐 Despliegue

Puedes desplegar esta aplicación en servicios como:

- Vercel
- Netlify
- Firebase Hosting


## 🔐 Seguridad

- JWT + Passport para autenticación robusta
- Contraseñas cifradas con bcrypt
- Validación en formularios

## 👥 Contribuciones

¡Tus ideas y mejoras son bienvenidas! Puedes enviar un **pull request** o abrir un **issue**.

## 🧑‍💻 Autor

- **Juan Ojeda**  
- 📧 [juanandresojeda77@gmail.com](mailto:juanandresojeda77@gmail.com)

## 📁 Repositorio

[https://github.com/JuanOLugo/jaolsystem](https://github.com/JuanOLugo/jaolsystem)

## ⚖️ Licencia

Licencia MIT — ¡Utiliza y mejora libremente! 🚀
