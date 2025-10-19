# Task 1 Expansion: Service & Supplier Catalog Integration

## Objetivo
Integrar la nueva taxonomía de categorías de servicios estilo Fiverr y los campos adicionales para proveedores en el alcance de la Tarea 1, asegurando que el formulario de publicación y los filtros compartan una fuente de verdad consistente.

## Recomendaciones clave

1. **Modelo de datos centralizado**
   - Crear `src/lib/catalog/serviceCatalog.ts` exportando un arreglo de categorías con la siguiente estructura:
     ```ts
     export interface ServiceCategory {
       id: string;
       name: { es: string; en: string };
       serviceType: 'digital' | 'creative' | 'industrial' | 'business' | 'lifestyle' | 'writing' | 'technology';
       subcategories: Array<{
         id: string;
         name: { es: string; en: string };
         defaultFields?: string[];
       }>;
     }
     ```
   - Incluir metadatos para mapear cada subcategoría a filtros (p. ej. `supportedFilters: ['priceRange', 'moq', 'deliveryTime']`).
   - Mantener las listas de servicios industriales específicas de HubMix como parte del mismo objeto para permitir su reutilización en filtros.

2. **Perfiles de proveedor**
   - Definir un esquema companion `src/lib/catalog/supplierProfileFields.ts` con los campos recomendados:
     ```ts
     export const supplierProfileFields = {
       companyName: { required: true, type: 'text' },
       businessType: { required: true, type: 'enum', options: ['manufacturer', 'trading', 'service'] },
       yearEstablished: { required: false, type: 'number', min: 1900 },
       employees: { required: false, type: 'number' },
       location: { required: true, type: 'location' },
       certifications: { required: false, type: 'string[]' },
       description: { required: true, type: 'textarea', maxLength: 500 },
       mainProducts: { required: true, type: 'text' },
       contactEmail: { required: true, type: 'email' },
       phone: { required: false, type: 'phone' },
       logoUrl: { required: false, type: 'url' },
       oemOdm: { required: false, type: 'boolean' },
       website: { required: false, type: 'url' }
     };
     ```
   - Usar este módulo tanto en formularios como en validaciones del backend para evitar divergencias.

3. **Campos de listing**
   - Ampliar la definición existente de listings (`src/types/listing.ts` si existe, o crearla) para incluir `moq`, `priceRange`, `deliveryTime`, `capacity`, `paymentTerms`, `origin`, `port`, `packaging`, `tradeTerms`, `sample`, `specifications`, `certifications`, `serviceType` y `images`.
   - Documentar en este mismo módulo qué campos son obligatorios según categoría (por ejemplo, `moq` obligatorio sólo en categorías industriales).

4. **Internacionalización temprana**
   - Guardar nombres y descripciones en ambos idiomas desde el inicio (`es`/`en`) para simplificar la posterior tarea de i18n.
   - Añadir helper `getCategoryLabel(categoryId, locale)` para usar en componentes.

5. **Interfaz de formulario**
   - Ajustar el formulario de publicación para que cargue dinámicamente subcategorías y campos adicionales según la categoría seleccionada.
   - Mostrar bloques condicionales: si la categoría está marcada como `serviceType === 'industrial'`, activar controles de `MOQ`, `priceRange`, `deliveryTime`, `certifications`, etc.
   - Añadir secciones de subida de imágenes múltiples (hasta 5) y campos de condiciones/capacidad.

6. **Filtros en Explore**
   - Sincronizar los filtros con el catálogo: cargar opciones de categorías/subcategorías desde `serviceCatalog`.
   - Incorporar nuevos filtros (ubicación, tipo de proveedor, precio, MOQ, certificaciones) utilizando los metadatos definidos en el catálogo y en los campos de supplier/profile.

7. **Sincronización con Supabase**
   - Actualizar las tablas o esquemas de Supabase para reflejar los nuevos campos.
   - Crear migraciones o scripts de seeds alineados con los archivos del catálogo para que la base de datos conozca la taxonomía.

## Siguientes pasos sugeridos
- Validar con el equipo de negocio las etiquetas definitivas en español/inglés antes de codificar.
- Confirmar cuáles campos son obligatorios para lanzar el MVP y cuáles pueden ser opcionales en una iteración futura.
- Preparar seeds iniciales para mostrar al menos un ejemplo por macro categoría en Home y Explore una vez que se conecten los datos reales.

