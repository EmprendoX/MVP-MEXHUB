# 🔧 GUÍA COMPLETA: CONFIGURACIÓN DE SUPABASE - HUBMEX MVP

**Objetivo:** Configurar Supabase completamente para desbloquear el backend del MVP  
**Tiempo estimado total:** 1.5 - 2 horas  
**Prioridad:** 🔥 CRÍTICA (BLOQUEADOR)

---

## 📋 ÍNDICE DE TAREAS

### FASE 1: Preparación y Creación de Proyecto (15 min)
- [x] Tarea 1.1: Crear cuenta en Supabase
- [x] Tarea 1.2: Crear nuevo proyecto
- [x] Tarea 1.3: Guardar credenciales

### FASE 2: Instalación de Dependencias (5 min)
- [ ] Tarea 2.1: Instalar paquetes npm
- [ ] Tarea 2.2: Verificar instalación

### FASE 3: Configuración de Variables de Entorno (10 min)
- [ ] Tarea 3.1: Crear archivo .env.local
- [ ] Tarea 3.2: Agregar .env.local al .gitignore
- [ ] Tarea 3.3: Crear .env.example

### FASE 4: Crear Cliente de Supabase (15 min)
- [ ] Tarea 4.1: Crear lib/supabaseClient.ts
- [ ] Tarea 4.2: Crear types/supabase.ts (tipos básicos)
- [ ] Tarea 4.3: Probar conexión

### FASE 5: Ejecutar Esquema de Base de Datos (20 min)
- [ ] Tarea 5.1: Abrir SQL Editor en Supabase
- [ ] Tarea 5.2: Ejecutar schema de users
- [ ] Tarea 5.3: Ejecutar schema de listings
- [ ] Tarea 5.4: Ejecutar schema de messages
- [ ] Tarea 5.5: Crear vista v_listings_explore
- [ ] Tarea 5.6: Verificar tablas creadas

### FASE 6: Configurar Storage (15 min)
- [ ] Tarea 6.1: Crear bucket para avatares
- [ ] Tarea 6.2: Crear bucket para imágenes de listings
- [ ] Tarea 6.3: Configurar políticas de acceso público

### FASE 7: Configurar Autenticación (10 min)
- [ ] Tarea 7.1: Habilitar Email Auth
- [ ] Tarea 7.2: Configurar URLs de redirección
- [ ] Tarea 7.3: Personalizar templates de email (opcional)

### FASE 8: Configurar RLS (Row Level Security) (15 min)
- [ ] Tarea 8.1: Habilitar RLS en tablas
- [ ] Tarea 8.2: Crear políticas básicas para users
- [ ] Tarea 8.3: Crear políticas básicas para listings
- [ ] Tarea 8.4: Crear políticas básicas para messages

### FASE 9: Generar Tipos TypeScript (10 min)
- [ ] Tarea 9.1: Instalar Supabase CLI
- [ ] Tarea 9.2: Generar tipos automáticos
- [ ] Tarea 9.3: Integrar tipos en el proyecto

### FASE 10: Verificación y Testing (10 min)
- [ ] Tarea 10.1: Verificar conexión desde la app
- [ ] Tarea 10.2: Probar query básico
- [ ] Tarea 10.3: Documentar credenciales de forma segura

---

## 🚀 DESGLOSE DETALLADO DE TAREAS

---

## FASE 1: PREPARACIÓN Y CREACIÓN DE PROYECTO

### ✅ Tarea 1.1: Crear cuenta en Supabase
**Tiempo:** 3 minutos  
**Estado:** PREREQUISITO

**Pasos:**
1. Ir a https://supabase.com
2. Click en "Start your project" o "Sign Up"
3. Registrarse con:
   - [ ] Email + Password, o
   - [ ] GitHub OAuth (recomendado)
4. Verificar email si es necesario

**Resultado esperado:**
- ✅ Cuenta de Supabase activa
- ✅ Acceso al Dashboard

---

### ✅ Tarea 1.2: Crear nuevo proyecto
**Tiempo:** 5 minutos  
**Estado:** PREREQUISITO

**Pasos:**
1. En el Dashboard de Supabase, click en "New Project"
2. Llenar el formulario:
   ```
   Nombre del proyecto: HUBMEX-MVP
   Database Password: [Genera una contraseña fuerte y guárdala]
   Region: South America (São Paulo) o US East (recomendado por latencia)
   Pricing Plan: Free (suficiente para MVP)
   ```
3. Click en "Create new project"
4. **ESPERAR 2-3 minutos** mientras se crea el proyecto

**Resultado esperado:**
- ✅ Proyecto "HUBMEX-MVP" creado
- ✅ Dashboard del proyecto accesible
- ✅ Status: "Active" (verde)

---

### ✅ Tarea 1.3: Guardar credenciales
**Tiempo:** 2 minutos  
**Estado:** CRÍTICO

**Pasos:**
1. En el Dashboard, ir a: **Settings** → **API**
2. Copiar y guardar en un archivo temporal:
   ```
   Project URL: https://[tu-proyecto].supabase.co
   Anon/Public Key: eyJh... (token largo)
   Service Role Key: eyJh... (token largo - NO COMPARTIR)
   ```
3. También guardar:
   ```
   Database Password: [la que creaste en el paso anterior]
   ```

**⚠️ IMPORTANTE:**
- **NO COMMITS** estas claves a Git
- Guárdalas en un gestor de contraseñas
- El Service Role Key es PRIVADO y nunca debe estar en el frontend

**Resultado esperado:**
- ✅ Project URL guardado
- ✅ Anon Key guardado
- ✅ Database Password guardado

---

## FASE 2: INSTALACIÓN DE DEPENDENCIAS

### 📦 Tarea 2.1: Instalar paquetes npm
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**Comando a ejecutar:**
```bash
cd /Users/agustinpascalsierra/HUBMEX-MVP
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
```

**Paquetes que se instalarán:**
- `@supabase/supabase-js` - Cliente principal de Supabase
- `@supabase/auth-helpers-nextjs` - Helpers para Next.js (SSR, API routes)
- `@supabase/auth-helpers-react` - Hooks de React para auth

**Resultado esperado:**
```
✅ @supabase/supabase-js@2.x.x
✅ @supabase/auth-helpers-nextjs@0.x.x
✅ @supabase/auth-helpers-react@0.x.x
```

---

### 📦 Tarea 2.2: Verificar instalación
**Tiempo:** 2 minutos  
**Estado:** PENDIENTE

**Comando a ejecutar:**
```bash
npm list | grep supabase
```

**Resultado esperado:**
```
├─ @supabase/auth-helpers-nextjs@x.x.x
├─ @supabase/auth-helpers-react@x.x.x
└─ @supabase/supabase-js@x.x.x
```

---

## FASE 3: CONFIGURACIÓN DE VARIABLES DE ENTORNO

### 🔐 Tarea 3.1: Crear archivo .env.local
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**Archivo a crear:** `/Users/agustinpascalsierra/HUBMEX-MVP/.env.local`

**Contenido:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[TU-PROYECTO].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...tu-anon-key...

# Service Role Key (SOLO PARA SERVER-SIDE)
SUPABASE_SERVICE_ROLE_KEY=eyJh...tu-service-role-key...

# Database Password (para referencia)
SUPABASE_DB_PASSWORD=tu-database-password
```

**⚠️ Reemplazar:**
- `[TU-PROYECTO]` con tu Project URL
- `eyJh...` con tu Anon Key real
- Service Role Key (copiado del Dashboard)

**Resultado esperado:**
- ✅ Archivo `.env.local` creado en la raíz
- ✅ 4 variables configuradas
- ✅ NO incluido en Git

---

### 🔐 Tarea 3.2: Agregar .env.local al .gitignore
**Tiempo:** 2 minutos  
**Estado:** PENDIENTE

**Archivo a editar:** `/Users/agustinpascalsierra/HUBMEX-MVP/.gitignore`

**Agregar estas líneas:**
```gitignore
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
.env

# Supabase
.supabase
```

**Resultado esperado:**
- ✅ `.env.local` ignorado por Git
- ✅ Variables sensibles protegidas

---

### 🔐 Tarea 3.3: Crear .env.example
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**Archivo a crear:** `/Users/agustinpascalsierra/HUBMEX-MVP/.env.example`

**Contenido:**
```bash
# Supabase Configuration
# Get these values from: https://app.supabase.com/project/[your-project]/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service Role Key (ONLY for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Password (for reference)
SUPABASE_DB_PASSWORD=your-db-password-here
```

**Propósito:**
- Template para otros developers
- Documentación de variables necesarias
- SÍ se incluye en Git (sin valores reales)

**Resultado esperado:**
- ✅ `.env.example` creado
- ✅ Template documentado

---

## FASE 4: CREAR CLIENTE DE SUPABASE

### 💻 Tarea 4.1: Crear lib/supabaseClient.ts
**Tiempo:** 10 minutos  
**Estado:** PENDIENTE

**Archivo a crear:** `/Users/agustinpascalsierra/HUBMEX-MVP/src/lib/supabaseClient.ts`

**Contenido completo:**
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Validar que las variables de entorno existan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Supabase environment variables are missing. Please check your .env.local file.'
  );
}

// Cliente de Supabase para el frontend
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'hubmex-auth-token',
  },
});

// Helper para obtener el usuario actual
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error.message);
    return null;
  }
  
  return user;
};

// Helper para verificar si hay sesión activa
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  
  return session;
};

// Export del tipo Database para uso en otros archivos
export type { Database } from '@/types/supabase';
```

**Resultado esperado:**
- ✅ Cliente de Supabase configurado
- ✅ Validación de variables de entorno
- ✅ Helpers de autenticación creados

---

### 💻 Tarea 4.2: Crear types/supabase.ts (tipos básicos)
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**Archivo a crear:** `/Users/agustinpascalsierra/HUBMEX-MVP/src/types/supabase.ts`

**Contenido inicial (temporal):**
```typescript
// Tipos básicos de Supabase para HUBMEX
// Estos serán reemplazados con tipos generados automáticamente

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nombre: string | null;
          email: string | null;
          tipo: 'proveedor' | 'comprador' | 'freelancer';
          ubicacion: string | null;
          descripcion: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre?: string | null;
          email?: string | null;
          tipo: 'proveedor' | 'comprador' | 'freelancer';
          ubicacion?: string | null;
          descripcion?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string | null;
          email?: string | null;
          tipo?: 'proveedor' | 'comprador' | 'freelancer';
          ubicacion?: string | null;
          descripcion?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          titulo: string;
          descripcion: string | null;
          categoria: string | null;
          tipo: 'producto' | 'servicio';
          precio: number | null;
          ubicacion: string | null;
          imagenes: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          titulo: string;
          descripcion?: string | null;
          categoria?: string | null;
          tipo: 'producto' | 'servicio';
          precio?: number | null;
          ubicacion?: string | null;
          imagenes?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          titulo?: string;
          descripcion?: string | null;
          categoria?: string | null;
          tipo?: 'producto' | 'servicio';
          precio?: number | null;
          ubicacion?: string | null;
          imagenes?: string[] | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          contenido: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          contenido: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          contenido?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      v_listings_explore: {
        Row: {
          id: string;
          titulo: string;
          descripcion: string | null;
          categoria: string | null;
          tipo: 'producto' | 'servicio';
          precio: number | null;
          ubicacion: string | null;
          imagenes: string[] | null;
          created_at: string;
          proveedor_id: string;
          proveedor_nombre: string | null;
          proveedor_ubicacion: string | null;
          proveedor_avatar: string | null;
        };
      };
    };
    Functions: {};
    Enums: {
      user_type: 'proveedor' | 'comprador' | 'freelancer';
      listing_type: 'producto' | 'servicio';
    };
  };
}
```

**Nota:** Estos tipos serán reemplazados automáticamente en la Fase 9.

**Resultado esperado:**
- ✅ Tipos TypeScript básicos creados
- ✅ Autocompletion funcionando en IDE

---

### 💻 Tarea 4.3: Probar conexión
**Tiempo:** 2 minutos  
**Estado:** PENDIENTE

**Crear archivo de prueba:** `/Users/agustinpascalsierra/HUBMEX-MVP/test-supabase-connection.ts`

**Contenido:**
```typescript
import { supabase } from './src/lib/supabaseClient';

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Verificar que el cliente existe
    console.log('✅ Supabase client initialized');
    console.log('   URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    // Test 2: Intentar una query simple
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.log('⚠️  Database query test:', error.message);
      console.log('   (This is expected if tables are not created yet)');
    } else {
      console.log('✅ Database connection successful!');
      console.log('   Query response:', data);
    }

    console.log('\n✨ Supabase connection test completed!\n');
  } catch (err) {
    console.error('❌ Connection test failed:', err);
  }
}

testConnection();
```

**Ejecutar:**
```bash
npx ts-node test-supabase-connection.ts
```

**Resultado esperado:**
```
✅ Supabase client initialized
⚠️  Database query test: relation "public.users" does not exist
   (This is expected if tables are not created yet)
```

---

## FASE 5: EJECUTAR ESQUEMA DE BASE DE DATOS

### 🗄️ Tarea 5.1: Abrir SQL Editor en Supabase
**Tiempo:** 2 minutos  
**Estado:** PENDIENTE

**Pasos:**
1. Ir al Dashboard de Supabase
2. En el menú lateral, click en **SQL Editor**
3. Click en **New Query**

**Resultado esperado:**
- ✅ SQL Editor abierto
- ✅ Editor de query en blanco listo

---

### 🗄️ Tarea 5.2: Ejecutar schema de users
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:** (del archivo `taskmaster/database.txt` líneas 6-48)

```sql
-- Extensiones necesarias
create extension if not exists pgcrypto;

-- ENUMS
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_type') then
    create type user_type as enum ('proveedor','comprador','freelancer');
  end if;
end $$;

-- TABLA USERS
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  nombre      text,
  email       text,
  tipo        user_type not null,
  ubicacion   text,
  descripcion text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Índices
create index if not exists idx_users_tipo       on public.users (tipo);
create index if not exists idx_users_ubicacion  on public.users (ubicacion);
create index if not exists idx_users_created_at on public.users (created_at desc);
```

**Pasos:**
1. Copiar el SQL de arriba
2. Pegarlo en el SQL Editor
3. Click en **RUN** o presionar `Ctrl + Enter`
4. Esperar confirmación: "Success. No rows returned"

**Verificar:**
```sql
SELECT * FROM public.users LIMIT 5;
```

**Resultado esperado:**
- ✅ Tabla `users` creada
- ✅ Enum `user_type` creado
- ✅ 3 índices creados
- ✅ Query de verificación retorna 0 rows

---

### 🗄️ Tarea 5.3: Ejecutar schema de listings
**Tiempo:** 4 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:** (del archivo `taskmaster/database.txt` líneas 50-87)

```sql
-- ENUM para listings
do $$
begin
  if not exists (select 1 from pg_type where typname = 'listing_type') then
    create type listing_type as enum ('producto','servicio');
  end if;
end $$;

-- TABLA LISTINGS
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  titulo      text not null,
  descripcion text,
  categoria   text,
  tipo        listing_type not null,
  precio      numeric,
  ubicacion   text,
  imagenes    text[],
  created_at  timestamptz not null default now(),

  constraint chk_listings_imagenes_max5
    check (imagenes is null or array_length(imagenes, 1) <= 5)
);

-- Índices
create index if not exists idx_listings_user            on public.listings (user_id);
create index if not exists idx_listings_tipo            on public.listings (tipo);
create index if not exists idx_listings_categoria       on public.listings (categoria);
create index if not exists idx_listings_ubicacion       on public.listings (ubicacion);
create index if not exists idx_listings_created_at_desc on public.listings (created_at desc);

-- Full-Text Search
alter table public.listings
  add column if not exists fts tsvector
  generated always as (
    setweight(to_tsvector('spanish', coalesce(titulo,'')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(descripcion,'')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(categoria,'')), 'C')
  ) stored;

create index if not exists idx_listings_fts on public.listings using gin (fts);
```

**Verificar:**
```sql
SELECT * FROM public.listings LIMIT 5;
```

**Resultado esperado:**
- ✅ Tabla `listings` creada
- ✅ Enum `listing_type` creado
- ✅ 5 índices normales + 1 GIN para FTS
- ✅ Constraint de máximo 5 imágenes
- ✅ Columna FTS generada

---

### 🗄️ Tarea 5.4: Ejecutar schema de messages
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:** (del archivo `taskmaster/database.txt` líneas 89-103)

```sql
-- TABLA MESSAGES
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  contenido   text not null,
  created_at  timestamptz not null default now()
);

-- Índices
create index if not exists idx_messages_inbox   on public.messages (receiver_id, created_at desc);
create index if not exists idx_messages_outbox  on public.messages (sender_id,  created_at desc);
```

**Verificar:**
```sql
SELECT * FROM public.messages LIMIT 5;
```

**Resultado esperado:**
- ✅ Tabla `messages` creada
- ✅ 2 índices para inbox y outbox
- ✅ Foreign keys a users configuradas

---

### 🗄️ Tarea 5.5: Crear vista v_listings_explore
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:** (del archivo `taskmaster/database.txt` líneas 105-125)

```sql
-- VISTA PARA JOIN RÁPIDO EN EXPLORAR
create or replace view public.v_listings_explore as
select
  l.id,
  l.titulo,
  l.descripcion,
  l.categoria,
  l.tipo,
  l.precio,
  l.ubicacion,
  l.imagenes,
  l.created_at,
  u.id          as proveedor_id,
  u.nombre      as proveedor_nombre,
  u.ubicacion   as proveedor_ubicacion,
  u.avatar_url  as proveedor_avatar
from public.listings l
join public.users    u on u.id = l.user_id;
```

**Verificar:**
```sql
SELECT * FROM public.v_listings_explore LIMIT 5;
```

**Resultado esperado:**
- ✅ Vista `v_listings_explore` creada
- ✅ Join automático entre listings y users
- ✅ Query funciona (retorna 0 rows por ahora)

---

### 🗄️ Tarea 5.6: Verificar tablas creadas
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**En Supabase Dashboard:**
1. Ir a **Table Editor** (menú lateral)
2. Verificar que aparezcan 3 tablas:
   - ✅ `users`
   - ✅ `listings`
   - ✅ `messages`

**SQL de verificación completa:**
```sql
-- Contar registros en cada tabla
SELECT 
  'users' as tabla, 
  count(*) as registros 
FROM public.users
UNION ALL
SELECT 
  'listings', 
  count(*) 
FROM public.listings
UNION ALL
SELECT 
  'messages', 
  count(*) 
FROM public.messages;
```

**Resultado esperado:**
```
tabla     | registros
----------|----------
users     | 0
listings  | 0
messages  | 0
```

---

## FASE 6: CONFIGURAR STORAGE

### 📁 Tarea 6.1: Crear bucket para avatares
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**Pasos:**
1. En el Dashboard, ir a **Storage** (menú lateral)
2. Click en **New bucket**
3. Configurar:
   ```
   Name: avatars
   Public bucket: ✅ YES (para que las imágenes sean accesibles)
   File size limit: 2 MB
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
4. Click en **Create bucket**

**Resultado esperado:**
- ✅ Bucket `avatars` creado
- ✅ Acceso público habilitado
- ✅ Límite de 2MB configurado

---

### 📁 Tarea 6.2: Crear bucket para imágenes de listings
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**Pasos:**
1. Click en **New bucket**
2. Configurar:
   ```
   Name: listings
   Public bucket: ✅ YES
   File size limit: 5 MB (imágenes de productos pueden ser más grandes)
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
3. Click en **Create bucket**

**Resultado esperado:**
- ✅ Bucket `listings` creado
- ✅ Acceso público habilitado
- ✅ Límite de 5MB configurado

---

### 📁 Tarea 6.3: Configurar políticas de acceso público
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**Para cada bucket (avatars y listings):**

1. Click en el bucket
2. Click en **Policies**
3. Click en **New Policy**
4. Seleccionar **Allow public access**
5. Configurar:
   ```
   Policy name: Public read access
   Allowed operations: SELECT (read only)
   Target roles: public
   ```
6. Click **Review** y luego **Save policy**

**También crear policy para uploads:**
1. **New Policy**
2. Seleccionar **Allow authenticated users to upload**
3. Configurar:
   ```
   Policy name: Authenticated users can upload
   Allowed operations: INSERT
   Target roles: authenticated
   ```
4. **Save policy**

**Resultado esperado:**
- ✅ Cualquiera puede ver las imágenes (public read)
- ✅ Solo usuarios autenticados pueden subir (authenticated insert)

---

## FASE 7: CONFIGURAR AUTENTICACIÓN

### 🔐 Tarea 7.1: Habilitar Email Auth
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**Pasos:**
1. En el Dashboard, ir a **Authentication** → **Providers**
2. Verificar que **Email** esté habilitado (debería estar por defecto)
3. Configurar:
   ```
   ✅ Enable email provider
   ✅ Confirm email: YES (recomendado para producción)
   ✅ Secure email change: YES
   ```

**Resultado esperado:**
- ✅ Email authentication habilitado
- ✅ Confirmación de email configurada

---

### 🔐 Tarea 7.2: Configurar URLs de redirección
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**Pasos:**
1. Ir a **Authentication** → **URL Configuration**
2. Configurar:
   ```
   Site URL: http://localhost:3000 (para desarrollo)
   
   Redirect URLs (una por línea):
   http://localhost:3000/**
   http://localhost:3000/dashboard
   http://localhost:3000/auth/callback
   ```

**Para producción (cuando despliegues):**
```
https://tu-dominio.com/**
https://tu-dominio.com/dashboard
https://tu-dominio.com/auth/callback
```

**Resultado esperado:**
- ✅ URLs de redirección configuradas
- ✅ Callbacks permitidos

---

### 🔐 Tarea 7.3: Personalizar templates de email (opcional)
**Tiempo:** 2 minutos  
**Estado:** OPCIONAL

**Pasos:**
1. Ir a **Authentication** → **Email Templates**
2. Puedes personalizar:
   - Confirm signup
   - Reset password
   - Magic Link

**Resultado esperado:**
- ✅ Templates por defecto funcionando
- ⭐ Templates personalizados (opcional)

---

## FASE 8: CONFIGURAR RLS (ROW LEVEL SECURITY)

### 🔒 Tarea 8.1: Habilitar RLS en tablas
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:**
```sql
-- Habilitar RLS en todas las tablas
alter table public.users    enable row level security;
alter table public.listings enable row level security;
alter table public.messages enable row level security;
```

**Verificar:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'listings', 'messages');
```

**Resultado esperado:**
```
tablename | rowsecurity
----------|------------
users     | true
listings  | true
messages  | true
```

---

### 🔒 Tarea 8.2: Crear políticas para users
**Tiempo:** 4 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:**
```sql
-- USERS: Leer todos los perfiles públicos
create policy "Users can view all profiles"
  on public.users
  for select
  using (true);

-- USERS: Actualizar solo el propio perfil
create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id);

-- USERS: Insertar solo con el propio ID de auth
create policy "Users can insert own profile"
  on public.users
  for insert
  with check (auth.uid() = id);
```

**Resultado esperado:**
- ✅ Todos pueden ver perfiles (pública)
- ✅ Solo puedes editar tu propio perfil
- ✅ Solo puedes crear tu propio perfil

---

### 🔒 Tarea 8.3: Crear políticas para listings
**Tiempo:** 4 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:**
```sql
-- LISTINGS: Leer todas las publicaciones
create policy "Listings are viewable by everyone"
  on public.listings
  for select
  using (true);

-- LISTINGS: Insertar solo si eres el dueño
create policy "Users can insert own listings"
  on public.listings
  for insert
  with check (auth.uid() = user_id);

-- LISTINGS: Actualizar solo tus propias publicaciones
create policy "Users can update own listings"
  on public.listings
  for update
  using (auth.uid() = user_id);

-- LISTINGS: Eliminar solo tus propias publicaciones
create policy "Users can delete own listings"
  on public.listings
  for delete
  using (auth.uid() = user_id);
```

**Resultado esperado:**
- ✅ Todos pueden ver publicaciones
- ✅ Solo puedes crear, editar y eliminar tus propias publicaciones

---

### 🔒 Tarea 8.4: Crear políticas para messages
**Tiempo:** 4 minutos  
**Estado:** PENDIENTE

**SQL a ejecutar:**
```sql
-- MESSAGES: Ver solo mensajes en los que participas
create policy "Users can view messages where they are sender or receiver"
  on public.messages
  for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- MESSAGES: Enviar mensajes solo como tú mismo
create policy "Users can insert messages as sender"
  on public.messages
  for insert
  with check (auth.uid() = sender_id);
```

**Resultado esperado:**
- ✅ Solo ves mensajes donde eres remitente o destinatario
- ✅ Solo puedes enviar mensajes como tú mismo
- ✅ No se pueden editar o eliminar mensajes (por diseño)

---

## FASE 9: GENERAR TIPOS TYPESCRIPT

### 🔧 Tarea 9.1: Instalar Supabase CLI
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**Comando a ejecutar:**
```bash
npm install supabase --save-dev
```

**Verificar instalación:**
```bash
npx supabase --version
```

**Resultado esperado:**
```
✅ supabase 1.x.x
```

---

### 🔧 Tarea 9.2: Generar tipos automáticos
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**Login en Supabase CLI:**
```bash
npx supabase login
```

**Generar tipos:**
```bash
npx supabase gen types typescript --project-id [TU-PROJECT-ID] --schema public > src/types/supabase.ts
```

**⚠️ Encontrar tu PROJECT-ID:**
- En el Dashboard, ir a **Settings** → **General**
- Copiar el "Reference ID"

**Resultado esperado:**
- ✅ Archivo `src/types/supabase.ts` actualizado con tipos reales
- ✅ Autocompletion mejorado en todo el proyecto

---

### 🔧 Tarea 9.3: Integrar tipos en el proyecto
**Tiempo:** 2 minutos  
**Estado:** PENDIENTE

**Verificar que `lib/supabaseClient.ts` use los tipos:**

El archivo ya debería tener:
```typescript
import type { Database } from '@/types/supabase';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  // ...
});
```

**Resultado esperado:**
- ✅ Cliente tipado correctamente
- ✅ Autocompletion funciona en queries

---

## FASE 10: VERIFICACIÓN Y TESTING

### ✅ Tarea 10.1: Verificar conexión desde la app
**Tiempo:** 3 minutos  
**Estado:** PENDIENTE

**Iniciar dev server:**
```bash
npm run dev
```

**Abrir browser console en http://localhost:3000**

**Pegar este código en la consola:**
```javascript
import { supabase } from './src/lib/supabaseClient';

// Test básico
const testConnection = async () => {
  const { data, error } = await supabase.from('users').select('count');
  console.log('Connection test:', { data, error });
};

testConnection();
```

**Resultado esperado:**
```
Connection test: { data: [...], error: null }
```

---

### ✅ Tarea 10.2: Probar query básico
**Tiempo:** 5 minutos  
**Estado:** PENDIENTE

**Crear un usuario de prueba:**

**En Supabase SQL Editor:**
```sql
-- Insertar usuario de prueba
insert into public.users (id, nombre, email, tipo, ubicacion, descripcion)
values (
  gen_random_uuid(),
  'Test User',
  'test@hubmex.com',
  'proveedor',
  'Guadalajara, Jalisco',
  'Usuario de prueba para validar la configuración'
);

-- Verificar
select * from public.users;
```

**En la app, probar query:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1);

console.log('Users:', data);
```

**Resultado esperado:**
- ✅ Query retorna el usuario de prueba
- ✅ Sin errores de conexión
- ✅ Tipos correctos en TypeScript

---

### ✅ Tarea 10.3: Documentar credenciales de forma segura
**Tiempo:** 2 minutos  
**Estado:** PENDIENTE

**Actualizar README.md con sección de setup:**

```markdown
## 🔐 Configuración de Supabase

Este proyecto usa Supabase como backend. Para configurarlo:

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia `.env.example` a `.env.local`
3. Completa las variables de entorno con tus credenciales:
   - Obtén `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` desde Settings → API
4. Ejecuta el schema SQL desde `taskmaster/database.txt` en el SQL Editor
5. Configura Storage buckets: `avatars` y `listings`
```

**Resultado esperado:**
- ✅ Documentación actualizada
- ✅ Instrucciones claras para otros developers

---

## 📊 CHECKLIST FINAL

### ✅ Verificación Completa

- [ ] **Proyecto Supabase creado y activo**
- [ ] **Dependencias npm instaladas** (`@supabase/supabase-js`, etc.)
- [ ] **Archivo .env.local creado con credenciales**
- [ ] **Cliente Supabase configurado** (`lib/supabaseClient.ts`)
- [ ] **Tipos TypeScript creados** (`types/supabase.ts`)
- [ ] **Tablas de BD creadas:**
  - [ ] users
  - [ ] listings
  - [ ] messages
  - [ ] v_listings_explore (vista)
- [ ] **Storage buckets creados:**
  - [ ] avatars
  - [ ] listings
- [ ] **Políticas de Storage configuradas**
- [ ] **Email Auth habilitado**
- [ ] **URLs de redirección configuradas**
- [ ] **RLS habilitado en todas las tablas**
- [ ] **Políticas RLS creadas para:**
  - [ ] users
  - [ ] listings
  - [ ] messages
- [ ] **Tipos generados con Supabase CLI**
- [ ] **Conexión probada y funcionando**
- [ ] **Usuario de prueba creado**
- [ ] **Documentación actualizada**

---

## 🎯 PRÓXIMOS PASOS (DESPUÉS DE SUPABASE)

Una vez completada esta configuración, podrás continuar con:

1. **TASK-04:** Implementar autenticación completa
   - `lib/api/auth.ts`
   - `lib/hooks/useAuth.ts`
   - `contexts/AuthContext.tsx`

2. **TASK-07:** Crear hooks personalizados
   - `useListings.ts`
   - `useMessages.ts`

3. **TASK-08:** Implementar CRUD de publicaciones

4. **TASK-09:** Implementar sistema de mensajería con real-time

---

## 📞 SOPORTE

**Si encuentras errores:**

1. Verifica que las variables de entorno estén bien copiadas
2. Revisa la consola del navegador para errores
3. Verifica en Supabase Dashboard → Logs que las queries lleguen
4. Comprueba las políticas RLS si tienes errores de permisos

**Errores comunes:**

- `relation "public.users" does not exist` → Ejecutar el schema SQL
- `Error: Invalid API key` → Verificar .env.local
- `Row level security policy violation` → Verificar políticas RLS
- `Bucket not found` → Crear buckets en Storage

---

**Tiempo total estimado:** 1.5 - 2 horas  
**Prioridad:** 🔥 CRÍTICA  
**Estado actual:** PENDIENTE

¡Buena suerte con la configuración! 🚀


