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
- **Control de versiones:** GitHub
- **Hosting:** Netlify
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
   ```
   
   Editar `.env.local` con tus credenciales de Supabase:
   - Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
   - Settings → API
   - Copia `Project URL` y `anon public` key
   - Pega en `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
     SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
     ```

4. **Configurar base de datos en Supabase**
   - Abre el SQL Editor en tu proyecto de Supabase
   - Copia y ejecuta el contenido de `taskmaster/database.txt`
   - Esto creará las tablas: `users`, `listings`, `messages`
   - También creará la vista `v_listings_explore`

5. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
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
│   ├─ supabaseClient.ts  # ✅ Cliente Supabase configurado
│   ├─ api/            # Funciones de API (pendiente)
│   └─ hooks/          # Hooks personalizados (pendiente)
├─ styles/             # Estilos globales
├─ types/              # Tipos TypeScript
│   └─ supabase.ts     # ✅ Tipos DB generados
└─ utils/              # Utilidades generales

public/                # Archivos estáticos
├─ logo.svg
├─ placeholder.jpg
└─ favicon.ico
```

## 🔧 Configuración de Supabase

### Estado: ✅ CONFIGURADO Y FUNCIONAL

El proyecto ya tiene Supabase completamente configurado:

**✅ Dependencias instaladas:**
- `@supabase/supabase-js@2.75.0` - Cliente principal
- `@supabase/auth-helpers-nextjs@0.10.0` - Helpers para Next.js
- `@supabase/auth-helpers-react@0.5.0` - Hooks para React

**✅ Archivos creados:**
- `src/lib/supabaseClient.ts` - Cliente configurado y listo
- `src/types/supabase.ts` - Tipos TypeScript de la BD
- `.env.local` - Variables de entorno (no en Git)
- `.env.example` - Template de ejemplo

**✅ Base de datos:**
- Tablas: `users`, `listings`, `messages`
- Vista: `v_listings_explore`
- Índices: 11 índices optimizados
- Full-Text Search en español configurado
- Proyecto: `https://zlydruqtfyetnnndxulq.supabase.co`

**📖 Para usar Supabase en tu código:**
```typescript
import { supabase } from '@/lib/supabaseClient';

// Query de ejemplo
const { data, error } = await supabase
  .from('listings')
  .select('*')
  .eq('tipo', 'producto');
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

El proyecto está configurado para deployment automático en Netlify:

1. Conectar repositorio de GitHub a Netlify
2. Configurar variables de entorno en Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy automático en cada push a main

## 📝 Roadmap

Ver `taskmaster/roadmap.txt` para el progreso detallado de tareas.

## 🤝 Contribución

1. Seguir las reglas establecidas en `rules.txt`
2. Revisar el PRD en `taskmaster/prd.txt`
3. Actualizar el roadmap después de cada tarea completada

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.
