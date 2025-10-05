# Componentes de Formularios Reutilizables

Este directorio contiene componentes de formularios reutilizables para HUBMEX.COM, diseñados siguiendo las especificaciones del PRD y building_in.txt.

## Componentes Base

### FormField
Campo de entrada básico con validación y estados de error.

```tsx
import { FormField } from '@/components/forms';

<FormField
  label="Email"
  name="email"
  type="email"
  placeholder="tu@empresa.com"
  value={email}
  onChange={handleChange}
  required
  error={errors.email}
/>
```

### FormTextarea
Campo de texto multilínea con contador de caracteres opcional.

```tsx
<FormTextarea
  label="Descripción"
  name="description"
  placeholder="Describe tu producto..."
  value={description}
  onChange={handleChange}
  rows={4}
  maxLength={500}
  required
/>
```

### FormSelect
Selector desplegable con opciones configurables.

```tsx
<FormSelect
  label="Categoría"
  name="category"
  value={category}
  onChange={handleChange}
  options={categoryOptions}
  required
/>
```

### FormRadioGroup
Grupo de botones de radio para selección única.

```tsx
<FormRadioGroup
  label="Tipo de Usuario"
  name="userType"
  value={userType}
  onChange={handleChange}
  options={userTypeOptions}
  required
/>
```

### FormCheckboxGroup
Grupo de casillas de verificación para selección múltiple.

```tsx
<FormCheckboxGroup
  label="Categorías"
  name="categories"
  values={selectedCategories}
  onChange={setSelectedCategories}
  options={categoryOptions}
  maxSelections={3}
/>
```

### ImageUpload
Componente para subir imágenes con vista previa y validación.

```tsx
<ImageUpload
  label="Imágenes del Producto"
  images={images}
  previews={previews}
  onChange={setImages}
  onPreviewsChange={setPreviews}
  maxImages={5}
  maxSizeMB={5}
/>
```

### FormButton
Botón de formulario con diferentes variantes y estados.

```tsx
<FormButton
  type="submit"
  variant="primary"
  size="lg"
  loading={isSubmitting}
  fullWidth
>
  Enviar Formulario
</FormButton>
```

## Formularios Completos

### LoginForm
Formulario de inicio de sesión completo con validación.

```tsx
import { LoginForm } from '@/components/forms';

<LoginForm
  onSubmit={handleLogin}
  loading={isLoading}
/>
```

### RegisterForm
Formulario de registro completo con selección de tipo de usuario.

```tsx
import { RegisterForm } from '@/components/forms';

<RegisterForm
  onSubmit={handleRegister}
  loading={isLoading}
/>
```

## Características

- ✅ **Diseño Responsive**: Todos los componentes se adaptan a diferentes tamaños de pantalla
- ✅ **Validación**: Validación integrada con estados de error
- ✅ **Accesibilidad**: Etiquetas, IDs y roles ARIA apropiados
- ✅ **Paleta de Colores**: Usa la paleta de colores México definida
- ✅ **TypeScript**: Completamente tipado para mejor experiencia de desarrollo
- ✅ **Reutilizable**: Componentes modulares y configurables

## Especificaciones del PRD

Estos componentes cumplen con las especificaciones del PRD:

- **Registro y Perfiles** (PRD 5.1): LoginForm y RegisterForm
- **Publicación de Productos** (PRD 5.2): FormField, FormTextarea, ImageUpload
- **Diseño UX/UI** (PRD 6): Paleta "Hecho en México", diseño limpio y profesional
- **Mobile-first y Responsive** (PRD 6): Todos los componentes son 100% responsive

## Uso Recomendado

1. Importa los componentes que necesites desde `@/components/forms`
2. Usa los componentes base para crear formularios personalizados
3. Usa los formularios completos para casos comunes como login/registro
4. Personaliza las opciones y validaciones según tus necesidades
5. Mantén consistencia con la paleta de colores y el diseño establecido
