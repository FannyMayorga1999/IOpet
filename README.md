# 🐾 ioPet

**ioPet** es una plataforma moderna de código abierto para la gestión de mascotas y horarios de alimentación. Consta de un backend en **Express + TypeScript** con **Firebase** como base de datos NoSQL, y un frontend en **Next.js 14+** con **App Router**.

---

## Arquitectura

El proyecto sigue una arquitectura **totalmente desacoplada**:

```
ioPet_system/
├── backend/          # API REST (Express + TypeScript)
├── frontend/         # UI (Next.js 14+ App Router)
├── firebase/         # Configuración y datos semilla de Firebase
├── esp-32/           # Firmware para hardware (no modificar)
└── README.md
```

## Stack Tecnológico

| Capa       | Tecnologías                          |
|------------|--------------------------------------|
| Backend    | Node.js, Express, TypeScript         |
| Frontend   | Next.js 14+, React 18, TypeScript    |
| Base de datos | Firebase Firestore / Realtime DB  |
| Autenticación | Firebase Auth (JWT)               |

## Estructura del Proyecto

### Backend (`backend/`)

```
backend/
├── src/
│   ├── configs/         # Configuración (Firebase, entorno)
│   ├── controllers/     # Controladores HTTP
│   ├── interfaces/      # Tipos TypeScript
│   ├── middlewares/      # Middleware (errores, validación, async)
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades (logger, respuestas)
│   ├── app.ts           # Configuración de Express
│   └── server.ts        # Punto de entrada
├── src/
│   └── seed.ts           # Script para poblar la base de datos
├── firebase-service-account.json  # Credenciales de Firebase (no subir)
├── .env.example
├── package.json
└── tsconfig.json
```

### Firebase (`firebase/`)

```
firebase/
├── seed-data/            # Datos de ejemplo en JSON
│   ├── pets.json
│   ├── feedingSchedules.json
│   ├── users.json
│   └── notifications.json
└── database.rules.json   # Reglas de seguridad
```

### Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── historial/   # Página de historial de alimentación
│   │   └── page.tsx     # Dashboard principal
│   ├── layout.tsx
│   └── page.tsx         # Redirección a /dashboard
├── components/
│   ├── Dashboard/       # Componentes del dashboard
│   ├── Layout/          # Sidebar, Header, Layout principal
│   └── ui/              # Componentes reutilizables
├── hooks/               # Custom hooks (useFetch, useFeedingHistory)
├── interfaces/          # Tipos TypeScript
├── services/            # Capa de API cliente
├── styles/              # Archivos CSS
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

## Instalación

### Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase (Firestore o Realtime Database)

### Backend

```bash
cd backend
npm install
# Colocar el archivo JSON de Firebase en backend/firebase-service-account.json
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Editar .env.local con la URL del backend
npm run dev
```

## Variables de Entorno

### Backend (`.env`)

| Variable     | Descripción                          |
|--------------|--------------------------------------|
| `PORT`       | Puerto del servidor (default: 4000)  |
| `NODE_ENV`   | Entorno (development/production)     |

> Las credenciales de Firebase se cargan automáticamente desde `backend/firebase-service-account.json`.

### Frontend (`.env.local`)

| Variable                | Descripción                              |
|-------------------------|------------------------------------------|
| `NEXT_PUBLIC_API_URL`   | URL base de la API (default: http://localhost:4000/api/v1) |

## Scripts

### Backend

| Comando           | Descripción                       |
|-------------------|-----------------------------------|
| `npm run dev`     | Inicia el servidor en desarrollo  |
| `npm run build`   | Compila TypeScript                |
| `npm start`       | Inicia el servidor en producción  |
| `npm run seed`    | Poblar Firestore con datos semilla |
| `npm run lint`    | Ejecuta el linter                 |

### Frontend

| Comando           | Descripción                       |
|-------------------|-----------------------------------|
| `npm run dev`     | Inicia Next.js en desarrollo      |
| `npm run build`   | Compila para producción           |
| `npm start`       | Inicia el servidor de producción  |
| `npm run lint`    | Ejecuta el linter                 |

## Docker

```bash
# Backend
cd backend
docker build -t iopet-backend .
docker run -p 4000:4000 iopet-backend

# Frontend
cd frontend
docker build -t iopet-frontend .
docker run -p 3000:3000 iopet-frontend
```

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Sube los cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto. Consulta el archivo `LICENSE` para más detalles.
