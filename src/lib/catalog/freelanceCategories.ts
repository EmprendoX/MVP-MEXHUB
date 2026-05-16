import type { FreelanceCategory, Locale } from '@/types/freelance';

export const freelanceCatalog: FreelanceCategory[] = [
  {
    id: 'graphic-design',
    name: { es: 'Diseño Gráfico', en: 'Graphic Design' },
    description: {
      es: 'Logos, branding, ilustración, packaging y diseño visual.',
      en: 'Logos, branding, illustration, packaging and visual design.',
    },
    icon: 'palette',
    subcategories: [
      {
        id: 'logo-design',
        name: { es: 'Diseño de logo', en: 'Logo design' },
        description: { es: 'Identidad visual de marca.', en: 'Brand visual identity.' },
      },
      {
        id: 'brand-identity',
        name: { es: 'Identidad de marca', en: 'Brand identity' },
        description: { es: 'Guías de estilo y branding completo.', en: 'Style guides and full branding.' },
      },
      {
        id: 'illustration',
        name: { es: 'Ilustración', en: 'Illustration' },
        description: { es: 'Ilustraciones digitales y tradicionales.', en: 'Digital and traditional illustration.' },
      },
      {
        id: 'packaging',
        name: { es: 'Diseño de packaging', en: 'Packaging design' },
        description: { es: 'Empaques y etiquetas.', en: 'Packaging and labels.' },
      },
    ],
  },
  {
    id: 'programming-tech',
    name: { es: 'Programación y Tecnología', en: 'Programming & Tech' },
    description: {
      es: 'Desarrollo web, móvil, APIs, integraciones y soporte técnico.',
      en: 'Web, mobile, APIs, integrations and tech support.',
    },
    icon: 'code',
    subcategories: [
      {
        id: 'web-development',
        name: { es: 'Desarrollo web', en: 'Web development' },
        description: { es: 'Sitios y aplicaciones web a medida.', en: 'Custom websites and web apps.' },
      },
      {
        id: 'mobile-apps',
        name: { es: 'Apps móviles', en: 'Mobile apps' },
        description: { es: 'iOS, Android y React Native.', en: 'iOS, Android and React Native.' },
      },
      {
        id: 'wordpress',
        name: { es: 'WordPress', en: 'WordPress' },
        description: { es: 'Sitios, temas y plugins.', en: 'Sites, themes and plugins.' },
      },
      {
        id: 'ecommerce',
        name: { es: 'E-commerce', en: 'E-commerce' },
        description: { es: 'Shopify, WooCommerce, Magento.', en: 'Shopify, WooCommerce, Magento.' },
      },
    ],
  },
  {
    id: 'writing-translation',
    name: { es: 'Redacción y Traducción', en: 'Writing & Translation' },
    description: {
      es: 'Copywriting, blogs, traducción EN/ES y revisión editorial.',
      en: 'Copywriting, blogs, EN/ES translation and editing.',
    },
    icon: 'pen',
    subcategories: [
      {
        id: 'copywriting',
        name: { es: 'Copywriting', en: 'Copywriting' },
        description: { es: 'Textos persuasivos para venta.', en: 'Persuasive sales copy.' },
      },
      {
        id: 'translation-en-es',
        name: { es: 'Traducción EN ↔ ES', en: 'EN ↔ ES translation' },
        description: { es: 'Traducción nativa bilingüe.', en: 'Native bilingual translation.' },
      },
      {
        id: 'blog-articles',
        name: { es: 'Artículos y blogs', en: 'Articles & blogs' },
        description: { es: 'Contenido SEO optimizado.', en: 'SEO-optimized content.' },
      },
      {
        id: 'proofreading',
        name: { es: 'Corrección de estilo', en: 'Proofreading' },
        description: { es: 'Revisión y edición de textos.', en: 'Text review and editing.' },
      },
    ],
  },
  {
    id: 'video-animation',
    name: { es: 'Video y Animación', en: 'Video & Animation' },
    description: {
      es: 'Edición, animación 2D/3D, motion graphics y videos para redes.',
      en: 'Editing, 2D/3D animation, motion graphics and social videos.',
    },
    icon: 'video',
    subcategories: [
      {
        id: 'video-editing',
        name: { es: 'Edición de video', en: 'Video editing' },
        description: { es: 'Edición profesional multiplataforma.', en: 'Pro multi-platform editing.' },
      },
      {
        id: 'motion-graphics',
        name: { es: 'Motion graphics', en: 'Motion graphics' },
        description: { es: 'Animación 2D y efectos.', en: '2D animation and effects.' },
      },
      {
        id: 'explainer-videos',
        name: { es: 'Videos explicativos', en: 'Explainer videos' },
        description: { es: 'Videos animados para productos.', en: 'Animated product videos.' },
      },
      {
        id: 'social-shorts',
        name: { es: 'Reels y shorts', en: 'Reels & shorts' },
        description: { es: 'Contenido vertical para redes.', en: 'Vertical social content.' },
      },
    ],
  },
  {
    id: 'music-audio',
    name: { es: 'Música y Audio', en: 'Music & Audio' },
    description: {
      es: 'Locución, producción musical, mezcla y mastering.',
      en: 'Voice-over, music production, mixing and mastering.',
    },
    icon: 'music',
    subcategories: [
      {
        id: 'voice-over',
        name: { es: 'Locución', en: 'Voice-over' },
        description: { es: 'Voces en español neutro e inglés.', en: 'Neutral Spanish and English voices.' },
      },
      {
        id: 'music-production',
        name: { es: 'Producción musical', en: 'Music production' },
        description: { es: 'Jingles, beats y composición original.', en: 'Jingles, beats and original composition.' },
      },
      {
        id: 'mixing-mastering',
        name: { es: 'Mezcla y mastering', en: 'Mixing & mastering' },
        description: { es: 'Post-producción de audio profesional.', en: 'Pro audio post-production.' },
      },
    ],
  },
  {
    id: 'digital-marketing',
    name: { es: 'Marketing Digital', en: 'Digital Marketing' },
    description: {
      es: 'SEO, ads, redes sociales, email y growth.',
      en: 'SEO, ads, social media, email and growth.',
    },
    icon: 'megaphone',
    subcategories: [
      {
        id: 'seo',
        name: { es: 'SEO', en: 'SEO' },
        description: { es: 'Posicionamiento orgánico.', en: 'Organic positioning.' },
      },
      {
        id: 'social-media',
        name: { es: 'Redes sociales', en: 'Social media' },
        description: { es: 'Gestión y contenido para redes.', en: 'Social media management and content.' },
      },
      {
        id: 'paid-ads',
        name: { es: 'Publicidad pagada', en: 'Paid ads' },
        description: { es: 'Google Ads, Meta Ads, TikTok Ads.', en: 'Google, Meta and TikTok Ads.' },
      },
      {
        id: 'email-marketing',
        name: { es: 'Email marketing', en: 'Email marketing' },
        description: { es: 'Automatizaciones y campañas.', en: 'Automations and campaigns.' },
      },
    ],
  },
  {
    id: 'business',
    name: { es: 'Negocios', en: 'Business' },
    description: {
      es: 'Asesoría, planes de negocio, finanzas y operaciones.',
      en: 'Consulting, business plans, finance and operations.',
    },
    icon: 'briefcase',
    subcategories: [
      {
        id: 'business-plans',
        name: { es: 'Planes de negocio', en: 'Business plans' },
        description: { es: 'Plan financiero y estratégico.', en: 'Financial and strategic plan.' },
      },
      {
        id: 'market-research',
        name: { es: 'Investigación de mercado', en: 'Market research' },
        description: { es: 'Análisis de mercado y competencia.', en: 'Market and competitor analysis.' },
      },
      {
        id: 'virtual-assistant',
        name: { es: 'Asistente virtual', en: 'Virtual assistant' },
        description: { es: 'Soporte administrativo remoto.', en: 'Remote administrative support.' },
      },
    ],
  },
  {
    id: 'data',
    name: { es: 'Datos', en: 'Data' },
    description: {
      es: 'Análisis, dashboards, scraping, ETL y bases de datos.',
      en: 'Analytics, dashboards, scraping, ETL and databases.',
    },
    icon: 'database',
    subcategories: [
      {
        id: 'data-analysis',
        name: { es: 'Análisis de datos', en: 'Data analysis' },
        description: { es: 'Insights y reportes.', en: 'Insights and reports.' },
      },
      {
        id: 'data-visualization',
        name: { es: 'Visualización', en: 'Data visualization' },
        description: { es: 'Dashboards en Tableau, Power BI, Looker.', en: 'Tableau, Power BI, Looker dashboards.' },
      },
      {
        id: 'web-scraping',
        name: { es: 'Web scraping', en: 'Web scraping' },
        description: { es: 'Extracción y procesamiento de datos.', en: 'Data extraction and processing.' },
      },
    ],
  },
  {
    id: 'ai-services',
    name: { es: 'Servicios de IA', en: 'AI Services' },
    description: {
      es: 'Chatbots, automatizaciones, prompt engineering y fine-tuning.',
      en: 'Chatbots, automations, prompt engineering and fine-tuning.',
    },
    icon: 'sparkles',
    subcategories: [
      {
        id: 'chatbots',
        name: { es: 'Chatbots', en: 'Chatbots' },
        description: { es: 'Bots para soporte y ventas.', en: 'Support and sales bots.' },
      },
      {
        id: 'ai-automation',
        name: { es: 'Automatización con IA', en: 'AI automation' },
        description: { es: 'n8n, Make, Zapier + LLMs.', en: 'n8n, Make, Zapier + LLMs.' },
      },
      {
        id: 'prompt-engineering',
        name: { es: 'Prompt engineering', en: 'Prompt engineering' },
        description: { es: 'Diseño y optimización de prompts.', en: 'Prompt design and optimization.' },
      },
    ],
  },
  {
    id: 'photography',
    name: { es: 'Fotografía', en: 'Photography' },
    description: {
      es: 'Fotografía de producto, retoque y edición.',
      en: 'Product photography, retouching and editing.',
    },
    icon: 'camera',
    subcategories: [
      {
        id: 'product-photo',
        name: { es: 'Foto de producto', en: 'Product photography' },
        description: { es: 'Para e-commerce y catálogos.', en: 'For e-commerce and catalogs.' },
      },
      {
        id: 'photo-retouching',
        name: { es: 'Retoque fotográfico', en: 'Photo retouching' },
        description: { es: 'Edición profesional en Photoshop.', en: 'Pro Photoshop editing.' },
      },
    ],
  },
];

export function getFreelanceCategoryById(id: string): FreelanceCategory | undefined {
  return freelanceCatalog.find((category) => category.id === id);
}

export function getFreelanceSubcategoryById(
  id: string
): { subcategory: FreelanceCategory['subcategories'][number]; category: FreelanceCategory } | undefined {
  for (const category of freelanceCatalog) {
    const subcategory = category.subcategories.find((sub) => sub.id === id);
    if (subcategory) {
      return { subcategory, category };
    }
  }
  return undefined;
}

export function localize(value: { es: string; en: string }, locale: Locale | string): string {
  return locale === 'en' ? value.en : value.es;
}
