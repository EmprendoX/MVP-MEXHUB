import type { Gig, Order } from '@/types/gig';

/**
 * MOCK DATA — Gigs estilo Fiverr.
 * Cuando conectemos Supabase, reemplazamos las funciones exportadas por
 * llamadas a `src/lib/api/*` manteniendo la misma firma.
 */

const IMG = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const AVATAR = (seed: string) =>
  `https://i.pravatar.cc/150?u=${seed}`;

export const mockGigs: Gig[] = [
  {
    id: 'gig-001',
    slug: 'diseno-de-logo-profesional-para-tu-marca',
    titulo: 'Diseñaré un logo profesional y moderno para tu marca',
    descripcion:
      'Soy diseñador gráfico con 8 años de experiencia creando identidades visuales para marcas en México y Latinoamérica. Entrego archivos vectoriales en AI, PDF, PNG y SVG listos para imprenta y redes sociales. Trabajo con revisiones ilimitadas hasta que quedes 100% satisfecho.',
    categoria: 'Diseño gráfico',
    subcategoria: 'Diseño de logo',
    tags: ['logo', 'branding', 'identidad', 'minimalista', 'vectorial'],
    imagenes: [
      IMG('logo-1'),
      IMG('logo-2'),
      IMG('logo-3'),
      IMG('logo-4'),
    ],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Básico',
        descripcion: '1 concepto de logo + archivos digitales',
        precio: 800,
        dias_entrega: 3,
        revisiones: 2,
        features: [
          '1 propuesta de logo',
          'Archivos PNG y JPG',
          '2 revisiones',
          'Entrega en 3 días',
        ],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Estándar',
        descripcion: '3 conceptos + manual de marca básico',
        precio: 1800,
        dias_entrega: 5,
        revisiones: 5,
        features: [
          '3 propuestas de logo',
          'Archivos vectoriales (AI, SVG)',
          'Manual de marca (5 páginas)',
          '5 revisiones',
          'Paleta de colores',
        ],
      },
      premium: {
        tier: 'premium',
        nombre: 'Premium',
        descripcion: 'Identidad completa + papelería',
        precio: 3500,
        dias_entrega: 7,
        revisiones: 'ilimitadas',
        features: [
          '5 propuestas de logo',
          'Todos los archivos vectoriales',
          'Manual de marca completo',
          'Tarjeta de presentación',
          'Firma de correo',
          'Revisiones ilimitadas',
          'Cesión de derechos',
        ],
      },
    },
    faq: [
      {
        pregunta: '¿En qué formatos entregas los archivos?',
        respuesta: 'AI, EPS, PDF, PNG (transparente), JPG y SVG.',
      },
      {
        pregunta: '¿Cedes los derechos del diseño?',
        respuesta:
          'Sí, en el paquete Premium cedo todos los derechos comerciales del diseño final.',
      },
      {
        pregunta: '¿Puedes trabajar con un brief específico?',
        respuesta:
          'Por supuesto, envíame tu brief o referencias y adapto el proceso.',
      },
    ],
    reviews: [
      {
        id: 'r-1',
        autor_nombre: 'María González',
        autor_avatar: AVATAR('maria'),
        autor_pais: 'México',
        rating: 5,
        comentario:
          'Excelente trabajo. Entendió la esencia de mi marca y entregó antes del plazo. 100% recomendado.',
        fecha: '2026-06-20',
        paquete: 'estandar',
      },
      {
        id: 'r-2',
        autor_nombre: 'Carlos Ruiz',
        autor_avatar: AVATAR('carlos'),
        autor_pais: 'Colombia',
        rating: 5,
        comentario: 'Muy profesional, comunicación clara y resultado impecable.',
        fecha: '2026-06-12',
        paquete: 'premium',
      },
      {
        id: 'r-3',
        autor_nombre: 'Ana Torres',
        autor_avatar: AVATAR('ana'),
        autor_pais: 'México',
        rating: 4,
        comentario: 'Buen trabajo, aunque las primeras propuestas necesitaron ajustes.',
        fecha: '2026-05-30',
        paquete: 'basico',
      },
    ],
    seller: {
      id: 'user-101',
      nombre: 'Diego Ramírez',
      avatar_url: AVATAR('diego'),
      ubicacion: 'CDMX, México',
      nivel: 'top_rated',
      rating: 4.9,
      total_reviews: 342,
      idiomas: ['Español', 'Inglés'],
      responde_en: '1 hora',
      ultima_entrega: 'hace 2 días',
      miembro_desde: '2022-03-15',
      descripcion:
        'Diseñador gráfico especializado en identidad de marca. Trabajo con startups y PyMEs.',
    },
    rating: 4.9,
    total_reviews: 342,
    total_ordenes: 512,
    precio_desde: 800,
    dias_entrega_min: 3,
    created_at: '2026-01-10',
  },
  {
    id: 'gig-002',
    slug: 'desarrollo-web-nextjs-react',
    titulo: 'Desarrollaré tu sitio web con Next.js y React optimizado',
    descripcion:
      'Ingeniero de software full-stack. Construyo sitios rápidos, SEO-friendly y responsive con Next.js, React y Tailwind. Incluye despliegue en Vercel y panel de contenido.',
    categoria: 'Programación y tecnología',
    subcategoria: 'Desarrollo web',
    tags: ['nextjs', 'react', 'tailwind', 'vercel', 'seo'],
    imagenes: [IMG('web-1'), IMG('web-2'), IMG('web-3')],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Landing',
        descripcion: 'Landing page de 1 sección con formulario',
        precio: 3500,
        dias_entrega: 5,
        revisiones: 2,
        features: [
          'Landing responsive',
          'Formulario de contacto',
          'Despliegue en Vercel',
          '2 revisiones',
        ],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Sitio corporativo',
        descripcion: 'Sitio de hasta 5 secciones con blog',
        precio: 9000,
        dias_entrega: 10,
        revisiones: 4,
        features: [
          'Hasta 5 páginas',
          'Blog con CMS',
          'SEO básico',
          'Google Analytics',
          '4 revisiones',
        ],
      },
      premium: {
        tier: 'premium',
        nombre: 'Full stack',
        descripcion: 'App con autenticación y base de datos',
        precio: 22000,
        dias_entrega: 21,
        revisiones: 'ilimitadas',
        features: [
          'Autenticación (Supabase/Auth0)',
          'Base de datos PostgreSQL',
          'Panel de administración',
          'Integración de pagos',
          'Revisiones ilimitadas',
          '30 días de soporte',
        ],
      },
    },
    faq: [
      {
        pregunta: '¿Qué stack usas?',
        respuesta: 'Next.js 14, React 18, TypeScript, Tailwind y Supabase.',
      },
      {
        pregunta: '¿Incluye hosting?',
        respuesta: 'Despliegue en Vercel gratis. Tú cubres dominio y servicios premium.',
      },
    ],
    reviews: [
      {
        id: 'r-4',
        autor_nombre: 'Sofía Herrera',
        autor_avatar: AVATAR('sofia'),
        autor_pais: 'México',
        rating: 5,
        comentario: 'Sitio entregado en tiempo, súper rápido y bonito.',
        fecha: '2026-07-01',
        paquete: 'estandar',
      },
    ],
    seller: {
      id: 'user-102',
      nombre: 'Luis Mendoza',
      avatar_url: AVATAR('luis'),
      ubicacion: 'Monterrey, México',
      nivel: 'nivel_2',
      rating: 4.8,
      total_reviews: 128,
      idiomas: ['Español', 'Inglés'],
      responde_en: '2 horas',
      ultima_entrega: 'hace 5 días',
      miembro_desde: '2023-01-20',
      descripcion: 'Full-stack engineer. Ex-Rappi. Especialidad: performance.',
    },
    rating: 4.8,
    total_reviews: 128,
    total_ordenes: 190,
    precio_desde: 3500,
    dias_entrega_min: 5,
    created_at: '2026-02-15',
  },
  {
    id: 'gig-003',
    slug: 'edicion-video-profesional',
    titulo: 'Editaré tu video profesional para YouTube o Instagram',
    descripcion:
      'Editor con más de 500 videos entregados. Cortes cinemáticos, color grading, subtítulos y motion graphics.',
    categoria: 'Video y animación',
    subcategoria: 'Edición de video',
    tags: ['video', 'youtube', 'reels', 'color-grading'],
    imagenes: [IMG('video-1'), IMG('video-2'), IMG('video-3')],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Corto',
        descripcion: 'Hasta 60 segundos, corte simple',
        precio: 500,
        dias_entrega: 2,
        revisiones: 1,
        features: ['Hasta 60s', 'Música libre', '1 revisión'],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Estándar',
        descripcion: 'Hasta 5 min con color grading',
        precio: 1500,
        dias_entrega: 4,
        revisiones: 3,
        features: [
          'Hasta 5 min',
          'Color grading',
          'Subtítulos',
          '3 revisiones',
        ],
      },
      premium: {
        tier: 'premium',
        nombre: 'Premium',
        descripcion: 'Hasta 15 min con motion graphics',
        precio: 4200,
        dias_entrega: 7,
        revisiones: 5,
        features: [
          'Hasta 15 min',
          'Motion graphics',
          'Intro y outro personalizados',
          'Sonido remasterizado',
          '5 revisiones',
        ],
      },
    },
    faq: [
      {
        pregunta: '¿Qué formato me envías?',
        respuesta: 'MP4 en 1080p o 4K según el paquete.',
      },
    ],
    reviews: [
      {
        id: 'r-5',
        autor_nombre: 'Pablo Vega',
        autor_avatar: AVATAR('pablo'),
        autor_pais: 'Argentina',
        rating: 5,
        comentario: 'Increíble edición. El color grading quedó espectacular.',
        fecha: '2026-07-05',
        paquete: 'premium',
      },
    ],
    seller: {
      id: 'user-103',
      nombre: 'Valeria López',
      avatar_url: AVATAR('valeria'),
      ubicacion: 'Guadalajara, México',
      nivel: 'nivel_1',
      rating: 4.7,
      total_reviews: 89,
      idiomas: ['Español'],
      responde_en: '30 min',
      ultima_entrega: 'hace 1 día',
      miembro_desde: '2024-05-10',
    },
    rating: 4.7,
    total_reviews: 89,
    total_ordenes: 120,
    precio_desde: 500,
    dias_entrega_min: 2,
    created_at: '2026-03-01',
  },
  {
    id: 'gig-004',
    slug: 'copywriting-landing-que-convierte',
    titulo: 'Escribiré copywriting persuasivo para tu landing page',
    descripcion:
      'Copywriter con experiencia en SaaS y ecommerce. Escribo copy que convierte: hero, features, testimonios y CTAs alineados a tu ICP.',
    categoria: 'Redacción y traducción',
    subcategoria: 'Copywriting',
    tags: ['copywriting', 'landing', 'saas', 'ecommerce'],
    imagenes: [IMG('copy-1'), IMG('copy-2')],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Hero',
        descripcion: 'Copy para 1 sección hero',
        precio: 600,
        dias_entrega: 2,
        revisiones: 2,
        features: ['1 hero (headline + sub + CTA)', '2 revisiones'],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Landing completa',
        descripcion: 'Copy para landing de hasta 6 secciones',
        precio: 2200,
        dias_entrega: 4,
        revisiones: 3,
        features: [
          'Hasta 6 secciones',
          'Research de ICP',
          '3 revisiones',
        ],
      },
      premium: {
        tier: 'premium',
        nombre: 'Funnel',
        descripcion: 'Landing + secuencia de 5 emails',
        precio: 5500,
        dias_entrega: 7,
        revisiones: 'ilimitadas',
        features: [
          'Landing completa',
          'Secuencia de 5 emails',
          'A/B test de headlines',
          'Revisiones ilimitadas',
        ],
      },
    },
    faq: [],
    reviews: [
      {
        id: 'r-6',
        autor_nombre: 'Fernanda Ríos',
        autor_avatar: AVATAR('fernanda'),
        autor_pais: 'México',
        rating: 5,
        comentario: 'Nuestra tasa de conversión subió 40% con el copy nuevo.',
        fecha: '2026-06-25',
        paquete: 'estandar',
      },
    ],
    seller: {
      id: 'user-104',
      nombre: 'Andrés Molina',
      avatar_url: AVATAR('andres'),
      ubicacion: 'CDMX, México',
      nivel: 'nivel_2',
      rating: 4.9,
      total_reviews: 156,
      idiomas: ['Español', 'Inglés'],
      responde_en: '1 hora',
      miembro_desde: '2023-08-01',
    },
    rating: 4.9,
    total_reviews: 156,
    total_ordenes: 210,
    precio_desde: 600,
    dias_entrega_min: 2,
    created_at: '2026-01-20',
  },
  {
    id: 'gig-005',
    slug: 'community-manager-redes-sociales',
    titulo: 'Gestionaré tus redes sociales por 1 mes (Instagram + TikTok)',
    descripcion:
      'Community manager con enfoque en crecimiento orgánico. Calendario editorial, diseño de posts y respuestas a comentarios.',
    categoria: 'Marketing digital',
    subcategoria: 'Redes sociales',
    tags: ['redes-sociales', 'instagram', 'tiktok', 'community-manager'],
    imagenes: [IMG('cm-1'), IMG('cm-2')],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Starter',
        descripcion: '12 posts al mes en 1 red',
        precio: 4500,
        dias_entrega: 30,
        revisiones: 2,
        features: ['12 posts', '1 red social', 'Calendario editorial'],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Growth',
        descripcion: '20 posts + stories en 2 redes',
        precio: 8500,
        dias_entrega: 30,
        revisiones: 3,
        features: [
          '20 posts',
          '2 redes sociales',
          'Stories diarias',
          'Reporte mensual',
        ],
      },
      premium: {
        tier: 'premium',
        nombre: 'Full',
        descripcion: '30 posts + 4 reels + respuestas',
        precio: 15000,
        dias_entrega: 30,
        revisiones: 'ilimitadas',
        features: [
          '30 posts',
          '4 reels/TikToks',
          'Respuesta a comentarios',
          'Reporte semanal',
          'Estrategia trimestral',
        ],
      },
    },
    faq: [],
    reviews: [],
    seller: {
      id: 'user-105',
      nombre: 'Camila Torres',
      avatar_url: AVATAR('camila'),
      ubicacion: 'Puebla, México',
      nivel: 'nivel_1',
      rating: 4.6,
      total_reviews: 45,
      idiomas: ['Español'],
      responde_en: '2 horas',
      miembro_desde: '2024-11-01',
    },
    rating: 4.6,
    total_reviews: 45,
    total_ordenes: 60,
    precio_desde: 4500,
    dias_entrega_min: 30,
    created_at: '2026-04-05',
  },
  {
    id: 'gig-006',
    slug: 'traduccion-espanol-ingles-nativo',
    titulo: 'Traduciré tus textos español ↔ inglés (nativo bilingüe)',
    descripcion:
      'Traductor certificado con 10 años de experiencia. Traducciones técnicas, legales y de marketing.',
    categoria: 'Redacción y traducción',
    subcategoria: 'Traducción',
    tags: ['traduccion', 'ingles', 'espanol', 'nativo'],
    imagenes: [IMG('trad-1')],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Básico',
        descripcion: 'Hasta 500 palabras',
        precio: 350,
        dias_entrega: 1,
        revisiones: 1,
        features: ['500 palabras', 'Entrega en 24h', '1 revisión'],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Estándar',
        descripcion: 'Hasta 2,000 palabras',
        precio: 1200,
        dias_entrega: 2,
        revisiones: 2,
        features: ['2,000 palabras', 'Corrección profesional', '2 revisiones'],
      },
      premium: {
        tier: 'premium',
        nombre: 'Premium',
        descripcion: 'Hasta 5,000 palabras + certificación',
        precio: 3000,
        dias_entrega: 4,
        revisiones: 3,
        features: [
          '5,000 palabras',
          'Traducción certificada',
          'Adaptación cultural',
          '3 revisiones',
        ],
      },
    },
    faq: [],
    reviews: [],
    seller: {
      id: 'user-106',
      nombre: 'Roberto Silva',
      avatar_url: AVATAR('roberto'),
      ubicacion: 'Tijuana, México',
      nivel: 'top_rated',
      rating: 5.0,
      total_reviews: 421,
      idiomas: ['Español', 'Inglés'],
      responde_en: '30 min',
      miembro_desde: '2021-06-15',
    },
    rating: 5.0,
    total_reviews: 421,
    total_ordenes: 620,
    precio_desde: 350,
    dias_entrega_min: 1,
    created_at: '2026-01-05',
  },
  {
    id: 'gig-007',
    slug: 'voz-en-off-comercial',
    titulo: 'Grabaré voz en off profesional para tu comercial o video',
    descripcion:
      'Locutor con estudio profesional. Voz cálida masculina para comerciales, e-learning y audiolibros.',
    categoria: 'Música y audio',
    subcategoria: 'Voz en off',
    tags: ['voz', 'locucion', 'comercial', 'espanol'],
    imagenes: [IMG('voz-1')],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Básico',
        descripcion: 'Hasta 100 palabras',
        precio: 450,
        dias_entrega: 1,
        revisiones: 1,
        features: ['100 palabras', 'Formato WAV o MP3', '1 revisión'],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Estándar',
        descripcion: 'Hasta 400 palabras + música',
        precio: 1500,
        dias_entrega: 2,
        revisiones: 2,
        features: ['400 palabras', 'Música de fondo', 'Mezcla profesional'],
      },
      premium: {
        tier: 'premium',
        nombre: 'Premium',
        descripcion: 'Hasta 1,000 palabras + derechos comerciales',
        precio: 3800,
        dias_entrega: 3,
        revisiones: 'ilimitadas',
        features: [
          '1,000 palabras',
          'Derechos comerciales',
          'Masterización',
          'Múltiples tomas',
        ],
      },
    },
    faq: [],
    reviews: [],
    seller: {
      id: 'user-107',
      nombre: 'Javier Morales',
      avatar_url: AVATAR('javier'),
      ubicacion: 'CDMX, México',
      nivel: 'nivel_2',
      rating: 4.8,
      total_reviews: 210,
      idiomas: ['Español', 'Inglés'],
      responde_en: '1 hora',
      miembro_desde: '2022-09-01',
    },
    rating: 4.8,
    total_reviews: 210,
    total_ordenes: 305,
    precio_desde: 450,
    dias_entrega_min: 1,
    created_at: '2026-02-10',
  },
  {
    id: 'gig-008',
    slug: 'consultoria-seo-tecnico',
    titulo: 'Auditaré el SEO técnico de tu sitio y entregaré plan de acción',
    descripcion:
      'Consultor SEO. Auditoría técnica completa: Core Web Vitals, indexación, arquitectura y schema.',
    categoria: 'Marketing digital',
    subcategoria: 'SEO',
    tags: ['seo', 'auditoria', 'tecnico', 'core-web-vitals'],
    imagenes: [IMG('seo-1'), IMG('seo-2')],
    paquetes: {
      basico: {
        tier: 'basico',
        nombre: 'Auditoría express',
        descripcion: 'Reporte automático + 10 recomendaciones',
        precio: 1500,
        dias_entrega: 3,
        revisiones: 1,
        features: ['Auditoría con Screaming Frog', 'Top 10 issues', 'Reporte PDF'],
      },
      estandar: {
        tier: 'estandar',
        nombre: 'Auditoría completa',
        descripcion: 'Reporte manual + plan de 30 días',
        precio: 4500,
        dias_entrega: 7,
        revisiones: 2,
        features: [
          'Auditoría manual',
          'Análisis de competencia',
          'Plan de acción 30 días',
          'Llamada de 1h',
        ],
      },
      premium: {
        tier: 'premium',
        nombre: 'Consultoría 90 días',
        descripcion: 'Auditoría + implementación + monitoreo',
        precio: 12000,
        dias_entrega: 14,
        revisiones: 'ilimitadas',
        features: [
          'Auditoría completa',
          'Implementación técnica',
          'Monitoreo mensual',
          '3 llamadas',
        ],
      },
    },
    faq: [],
    reviews: [],
    seller: {
      id: 'user-108',
      nombre: 'Marcelo Aguirre',
      avatar_url: AVATAR('marcelo'),
      ubicacion: 'CDMX, México',
      nivel: 'top_rated',
      rating: 4.9,
      total_reviews: 302,
      idiomas: ['Español', 'Inglés'],
      responde_en: '2 horas',
      miembro_desde: '2020-03-01',
    },
    rating: 4.9,
    total_reviews: 302,
    total_ordenes: 405,
    precio_desde: 1500,
    dias_entrega_min: 3,
    created_at: '2026-01-15',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    gig_id: 'gig-001',
    gig_titulo: 'Diseñaré un logo profesional y moderno para tu marca',
    gig_imagen: IMG('logo-1'),
    buyer_id: 'user-me',
    buyer_nombre: 'Agustín (tú)',
    seller_id: 'user-101',
    seller_nombre: 'Diego Ramírez',
    seller_avatar: AVATAR('diego'),
    paquete: 'estandar',
    precio: 1800,
    estado: 'in_progress',
    fecha_creacion: '2026-07-12',
    fecha_entrega_estimada: '2026-07-17',
    requerimientos:
      'Marca de café orgánico. Estilo minimalista, colores tierra. Palabras clave: naturaleza, calidez.',
    timeline: [
      {
        estado: 'created',
        fecha: '2026-07-12',
        titulo: 'Orden creada',
        descripcion: 'Compraste el paquete Estándar.',
      },
      {
        estado: 'in_progress',
        fecha: '2026-07-12',
        titulo: 'Vendedor aceptó la orden',
        descripcion: 'Diego está trabajando en tu pedido.',
      },
      {
        estado: 'message',
        fecha: '2026-07-13',
        titulo: 'Nuevo mensaje del vendedor',
        descripcion: 'Diego envió las primeras propuestas.',
      },
    ],
  },
  {
    id: 'ord-002',
    gig_id: 'gig-004',
    gig_titulo: 'Escribiré copywriting persuasivo para tu landing page',
    gig_imagen: IMG('copy-1'),
    buyer_id: 'user-me',
    buyer_nombre: 'Agustín (tú)',
    seller_id: 'user-104',
    seller_nombre: 'Andrés Molina',
    seller_avatar: AVATAR('andres'),
    paquete: 'basico',
    precio: 600,
    estado: 'delivered',
    fecha_creacion: '2026-07-08',
    fecha_entrega_estimada: '2026-07-10',
    requerimientos: 'Landing para HUBMEX, marketplace B2B mexicano.',
    timeline: [
      {
        estado: 'created',
        fecha: '2026-07-08',
        titulo: 'Orden creada',
      },
      {
        estado: 'in_progress',
        fecha: '2026-07-08',
        titulo: 'Vendedor aceptó la orden',
      },
      {
        estado: 'delivered',
        fecha: '2026-07-10',
        titulo: 'Vendedor entregó tu pedido',
        descripcion: 'Revisa la entrega y aprueba o solicita revisión.',
      },
    ],
  },
  {
    id: 'ord-003',
    gig_id: 'gig-006',
    gig_titulo: 'Traduciré tus textos español ↔ inglés',
    gig_imagen: IMG('trad-1'),
    buyer_id: 'user-me',
    buyer_nombre: 'Agustín (tú)',
    seller_id: 'user-106',
    seller_nombre: 'Roberto Silva',
    seller_avatar: AVATAR('roberto'),
    paquete: 'basico',
    precio: 350,
    estado: 'completed',
    fecha_creacion: '2026-06-25',
    fecha_entrega_estimada: '2026-06-26',
    timeline: [
      { estado: 'created', fecha: '2026-06-25', titulo: 'Orden creada' },
      { estado: 'in_progress', fecha: '2026-06-25', titulo: 'Vendedor aceptó' },
      { estado: 'delivered', fecha: '2026-06-26', titulo: 'Entrega recibida' },
      {
        estado: 'completed',
        fecha: '2026-06-27',
        titulo: 'Orden completada',
        descripcion: 'Aprobaste la entrega y liberaste el pago.',
      },
      {
        estado: 'review',
        fecha: '2026-06-27',
        titulo: 'Dejaste una reseña',
        descripcion: '⭐⭐⭐⭐⭐ Excelente trabajo.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// API-shape helpers — misma firma que tendrán las llamadas reales de Supabase.
// ---------------------------------------------------------------------------

export interface GigFilters {
  categoria?: string | string[];
  precioMin?: number;
  precioMax?: number;
  entregaMax?: number;
  ratingMin?: number;
  searchQuery?: string;
}

export function listGigs(filters: GigFilters = {}): Gig[] {
  let result = [...mockGigs];

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (g) =>
        g.titulo.toLowerCase().includes(q) ||
        g.descripcion.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.categoria) {
    const cats = Array.isArray(filters.categoria) ? filters.categoria : [filters.categoria];
    result = result.filter((g) => cats.includes(g.categoria));
  }

  if (typeof filters.precioMin === 'number') {
    result = result.filter((g) => g.precio_desde >= filters.precioMin!);
  }

  if (typeof filters.precioMax === 'number') {
    result = result.filter((g) => g.precio_desde <= filters.precioMax!);
  }

  if (typeof filters.entregaMax === 'number') {
    result = result.filter((g) => g.dias_entrega_min <= filters.entregaMax!);
  }

  if (typeof filters.ratingMin === 'number') {
    result = result.filter((g) => g.rating >= filters.ratingMin!);
  }

  return result;
}

export function getGigById(id: string): Gig | undefined {
  return mockGigs.find((g) => g.id === id || g.slug === id);
}

export function listOrders(): Order[] {
  return mockOrders;
}

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id);
}
