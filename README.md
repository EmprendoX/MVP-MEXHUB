# HUBMEX.COM MVP v1.0

> Directorio digital que conecta a fabricantes, proveedores de servicios y emprendedores dentro del ecosistema de manufactura mexicana.

## 🎯 Propósito del MVP

Construir la primera versión funcional de HUBMEX.COM que permita:
- Los proveedores creen cuentas, publiquen sus productos o servicios y reciban mensajes
- Los compradores o emprendedores puedan explorar, filtrar y contactar proveedores fácilmente
- Validar la adopción inicial y medir las interacciones

## 🛠️ Tecnologías

- **Frontend:** React + Next.js + TailwindCSS
- **Backend:** Supabase (DB + Auth + Storage)
- **Hosting:** Vercel
- **Email:** Supabase Functions / Resend API
- **Lenguaje:** TypeScript

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18.0.0 o superior
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd HUBMEX-MVP
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales de Supabase
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
src/
├─ components/          # Componentes reutilizables
│   ├─ Navbar.tsx
│   ├─ Hero.tsx
│   ├─ CardItem.tsx
│   ├─ Filters.tsx
│   └─ Footer.tsx
├─ pages/              # Páginas de la aplicación
│   ├─ index.tsx       # Página principal
│   ├─ explore.tsx     # Búsqueda y filtros
│   ├─ publish.tsx     # Crear publicación
│   ├─ dashboard.tsx   # Panel del usuario
│   ├─ messages.tsx    # Mensajería
│   └─ profile/[id].tsx # Perfil público
├─ lib/                # Utilidades y configuración
│   ├─ supabaseClient.ts
│   ├─ api/            # Funciones de API
│   └─ hooks/          # Hooks personalizados
├─ styles/             # Estilos globales
├─ types/              # Tipos TypeScript
└─ utils/              # Utilidades generales

public/                # Archivos estáticos
├─ logo.svg
├─ placeholder.jpg
└─ favicon.ico
```

## 🎨 Paleta de Colores

- **Verde México:** `#1E8543`
- **Dorado:** `#D6B26C`
- **Gris Claro:** `#F4F4F4`
- **Blanco:** `#FFFFFF`

## 📊 Base de Datos

### Tablas principales:
- **users:** Información de usuarios (proveedores, compradores, freelancers)
- **listings:** Productos y servicios publicados
- **messages:** Sistema de mensajería interna

## 🧪 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 📈 Métricas de Éxito (KPIs MVP)

- **Usuarios activos:** 500 en 60 días
- **Publicaciones activas:** 1,000
- **Conexiones generadas:** 200+
- **Tasa de retención semanal:** > 35%
- **Feedback positivo:** > 8/10

## 🚀 Deployment

El proyecto está configurado para deployment automático en Vercel:

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push a main

## 📝 Roadmap

Ver `taskmaster/roadmap.txt` para el progreso detallado de tareas.

## 🤝 Contribución

1. Seguir las reglas establecidas en `rules.txt`
2. Revisar el PRD en `taskmaster/prd.txt`
3. Actualizar el roadmap después de cada tarea completada

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.
