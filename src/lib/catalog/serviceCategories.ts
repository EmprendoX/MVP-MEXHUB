export type ServiceTypeTag = 'Industrial' | 'Digital' | 'Creativo';

export interface ServiceSubcategory {
  id: string;
  name: string;
  description: string;
  serviceTypes: ServiceTypeTag[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  serviceTypes: ServiceTypeTag[];
  subcategories: ServiceSubcategory[];
}

export const SERVICE_TYPES: ServiceTypeTag[] = ['Industrial', 'Digital', 'Creativo'];

export const serviceCatalog: ServiceCategory[] = [
  {
    id: 'manufactura-avanzada',
    name: 'Manufactura avanzada',
    description: 'Equipos y procesos para producción de alto desempeño y precisión.',
    serviceTypes: ['Industrial'],
    subcategories: [
      {
        id: 'maquinado-cnc',
        name: 'Maquinado CNC',
        description: 'Fresado, torneado y mecanizado de piezas metálicas o plásticas.',
        serviceTypes: ['Industrial'],
      },
      {
        id: 'moldeo-inyeccion',
        name: 'Moldeo e inyección',
        description: 'Servicios de moldeo por inyección, soplado y extrusión.',
        serviceTypes: ['Industrial'],
      },
      {
        id: 'impresion-3d-industrial',
        name: 'Impresión 3D industrial',
        description: 'Fabricación aditiva de prototipos y series cortas.',
        serviceTypes: ['Industrial', 'Digital'],
      },
      {
        id: 'fabricacion-hoja-metal',
        name: 'Fabricación de hoja metálica',
        description: 'Doblado, corte láser y punzonado de lámina.',
        serviceTypes: ['Industrial'],
      },
    ],
  },
  {
    id: 'componentes-electronica',
    name: 'Componentes y electrónica',
    description: 'Producción de componentes electrónicos y soluciones embebidas.',
    serviceTypes: ['Industrial', 'Digital'],
    subcategories: [
      {
        id: 'circuitos-impresos',
        name: 'Circuitos impresos',
        description: 'Diseño y manufactura de PCB y PCBA.',
        serviceTypes: ['Industrial', 'Digital'],
      },
      {
        id: 'sistemas-embebidos',
        name: 'Sistemas embebidos',
        description: 'Desarrollo de firmware y hardware especializado.',
        serviceTypes: ['Digital', 'Industrial'],
      },
      {
        id: 'sensores-iot',
        name: 'Sensores e IoT',
        description: 'Dispositivos conectados para monitoreo y automatización.',
        serviceTypes: ['Digital'],
      },
    ],
  },
  {
    id: 'textiles-materiales',
    name: 'Textiles y nuevos materiales',
    description: 'Soluciones textiles técnicas y materiales avanzados.',
    serviceTypes: ['Industrial', 'Creativo'],
    subcategories: [
      {
        id: 'textiles-tecnicos',
        name: 'Textiles técnicos',
        description: 'Tejidos especializados para sectores automotriz y médico.',
        serviceTypes: ['Industrial'],
      },
      {
        id: 'acabados-especiales',
        name: 'Acabados especiales',
        description: 'Procesos de teñido, recubrimiento y tratamientos funcionales.',
        serviceTypes: ['Industrial', 'Creativo'],
      },
      {
        id: 'materiales-compuestos',
        name: 'Materiales compuestos',
        description: 'Fabricación de compuestos y soluciones híbridas.',
        serviceTypes: ['Industrial'],
      },
    ],
  },
  {
    id: 'ingenieria-diseno',
    name: 'Ingeniería y diseño',
    description: 'Servicios de conceptualización, prototipado y validación de productos.',
    serviceTypes: ['Creativo', 'Digital'],
    subcategories: [
      {
        id: 'diseno-industrial',
        name: 'Diseño industrial',
        description: 'Diseño de productos orientados a manufactura y mercado.',
        serviceTypes: ['Creativo'],
      },
      {
        id: 'servicios-cad-cae',
        name: 'Servicios CAD/CAE',
        description: 'Modelado 3D, simulaciones y análisis de ingeniería.',
        serviceTypes: ['Digital'],
      },
      {
        id: 'prototipado-rapido',
        name: 'Prototipado rápido',
        description: 'Iteraciones rápidas con tecnologías digitales y manuales.',
        serviceTypes: ['Creativo', 'Digital'],
      },
    ],
  },
  {
    id: 'tecnologias-digitales',
    name: 'Tecnologías digitales',
    description: 'Software y plataformas que habilitan la industria 4.0.',
    serviceTypes: ['Digital'],
    subcategories: [
      {
        id: 'software-industrial',
        name: 'Software industrial',
        description: 'Sistemas MES, ERP y soluciones especializadas.',
        serviceTypes: ['Digital'],
      },
      {
        id: 'integracion-iot',
        name: 'Integración IoT',
        description: 'Plataformas y conectividad para monitoreo y control.',
        serviceTypes: ['Digital'],
      },
      {
        id: 'automatizacion-inteligente',
        name: 'Automatización inteligente',
        description: 'Robótica colaborativa, analítica y machine learning.',
        serviceTypes: ['Digital', 'Industrial'],
      },
    ],
  },
  {
    id: 'logistica-supply-chain',
    name: 'Logística y supply chain',
    description: 'Servicios para mover, almacenar y proteger productos.',
    serviceTypes: ['Industrial'],
    subcategories: [
      {
        id: 'gestion-almacenes',
        name: 'Gestión de almacenes',
        description: 'Operación de centros de distribución y fulfilment.',
        serviceTypes: ['Industrial', 'Digital'],
      },
      {
        id: 'transporte-especializado',
        name: 'Transporte especializado',
        description: 'Soluciones para mercancías de alto valor o condiciones especiales.',
        serviceTypes: ['Industrial'],
      },
      {
        id: 'servicios-embalaje',
        name: 'Servicios de embalaje',
        description: 'Diseño y producción de empaques industriales.',
        serviceTypes: ['Industrial', 'Creativo'],
      },
    ],
  },
  {
    id: 'consultoria-servicios',
    name: 'Consultoría y servicios especializados',
    description: 'Expertos para optimizar procesos, calidad y talento.',
    serviceTypes: ['Industrial', 'Creativo'],
    subcategories: [
      {
        id: 'consultoria-calidad',
        name: 'Consultoría en calidad',
        description: 'Implementación de sistemas y auditorías de calidad.',
        serviceTypes: ['Industrial'],
      },
      {
        id: 'certificaciones-normativas',
        name: 'Certificaciones y normativas',
        description: 'Acompañamiento para cumplir estándares nacionales e internacionales.',
        serviceTypes: ['Industrial'],
      },
      {
        id: 'capacitacion-tecnica',
        name: 'Capacitación técnica',
        description: 'Formación especializada para equipos de manufactura e innovación.',
        serviceTypes: ['Industrial', 'Creativo'],
      },
    ],
  },
];

export const getCategoryById = (categoryId: string): ServiceCategory | undefined =>
  serviceCatalog.find((category) => category.id === categoryId);

export const getCategoryByName = (name: string): ServiceCategory | undefined =>
  serviceCatalog.find((category) => category.name === name);

export const getSubcategoriesByCategoryId = (categoryId: string): ServiceSubcategory[] =>
  getCategoryById(categoryId)?.subcategories ?? [];

export const getSubcategoryById = (
  subcategoryId: string
): { subcategory: ServiceSubcategory; category: ServiceCategory } | undefined => {
  for (const category of serviceCatalog) {
    const subcategory = category.subcategories.find((item) => item.id === subcategoryId);
    if (subcategory) {
      return { subcategory, category };
    }
  }
  return undefined;
};

export const getSubcategoryByName = (
  name: string
): { subcategory: ServiceSubcategory; category: ServiceCategory } | undefined => {
  for (const category of serviceCatalog) {
    const subcategory = category.subcategories.find((item) => item.name === name);
    if (subcategory) {
      return { subcategory, category };
    }
  }
  return undefined;
};

export const getAllSubcategories = (): ServiceSubcategory[] =>
  serviceCatalog.flatMap((category) => category.subcategories);
