import type { LocalizedString, Locale } from '@/types/freelance';

export interface Review {
  id: string;
  reviewer: {
    name: string;
    country: string;
    flag: string;
    avatarInitials: string;
  };
  rating: number;
  comment: LocalizedString;
  daysAgo: number;
  packageTier: 'basic' | 'standard' | 'premium';
  priceUSD: number;
  deliveryDays: number;
}

const reviewPool: Review[] = [
  {
    id: 'r1',
    reviewer: { name: 'James Wilson', country: 'United States', flag: '🇺🇸', avatarInitials: 'JW' },
    rating: 5,
    comment: {
      es: 'Excelente trabajo, comunicación rápida y entrega antes del plazo. Volveré a contratar sin duda.',
      en: 'Excellent work, fast communication and early delivery. Will definitely hire again.',
    },
    daysAgo: 4,
    packageTier: 'standard',
    priceUSD: 85,
    deliveryDays: 4,
  },
  {
    id: 'r2',
    reviewer: { name: 'Emma Thompson', country: 'United Kingdom', flag: '🇬🇧', avatarInitials: 'ET' },
    rating: 5,
    comment: {
      es: 'Calidad muy superior a lo que esperaba. Domina perfectamente el inglés y captó la visión a la primera.',
      en: 'Quality far above what I expected. Perfect English and got the vision right on the first try.',
    },
    daysAgo: 12,
    packageTier: 'premium',
    priceUSD: 220,
    deliveryDays: 10,
  },
  {
    id: 'r3',
    reviewer: { name: 'Lukas Müller', country: 'Germany', flag: '🇩🇪', avatarInitials: 'LM' },
    rating: 4,
    comment: {
      es: 'Buen trabajo. Tuvimos una revisión menor y la solucionó de inmediato.',
      en: 'Good job. We had a minor revision and it was resolved immediately.',
    },
    daysAgo: 21,
    packageTier: 'basic',
    priceUSD: 35,
    deliveryDays: 3,
  },
  {
    id: 'r4',
    reviewer: { name: 'Sarah Chen', country: 'Canada', flag: '🇨🇦', avatarInitials: 'SC' },
    rating: 5,
    comment: {
      es: 'Profesional 10/10. Mismo huso horario que nosotros hizo todo más fácil.',
      en: '10/10 pro. Same time zone as us made everything easier.',
    },
    daysAgo: 34,
    packageTier: 'standard',
    priceUSD: 85,
    deliveryDays: 5,
  },
  {
    id: 'r5',
    reviewer: { name: 'Diego Fernández', country: 'Spain', flag: '🇪🇸', avatarInitials: 'DF' },
    rating: 5,
    comment: {
      es: 'Recomendado al 100%. Atento a cada detalle y muy creativo.',
      en: 'Recommended 100%. Attentive to every detail and very creative.',
    },
    daysAgo: 47,
    packageTier: 'premium',
    priceUSD: 220,
    deliveryDays: 10,
  },
  {
    id: 'r6',
    reviewer: { name: 'Aisha Khan', country: 'Australia', flag: '🇦🇺', avatarInitials: 'AK' },
    rating: 5,
    comment: {
      es: 'Trabajo impecable, super accesible y excelente relación calidad-precio.',
      en: 'Flawless work, super accessible and great value for money.',
    },
    daysAgo: 56,
    packageTier: 'basic',
    priceUSD: 35,
    deliveryDays: 3,
  },
  {
    id: 'r7',
    reviewer: { name: 'François Dubois', country: 'France', flag: '🇫🇷', avatarInitials: 'FD' },
    rating: 4,
    comment: {
      es: 'Buena experiencia general. El entregable cumplió lo prometido.',
      en: 'Good overall experience. The deliverable met what was promised.',
    },
    daysAgo: 72,
    packageTier: 'standard',
    priceUSD: 85,
    deliveryDays: 5,
  },
];

export function getReviewsForGig(gigId: string, count = 5): Review[] {
  // Deterministic pseudo-random selection by gig ID
  const seed = gigId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    out.push(reviewPool[(seed + i) % reviewPool.length]);
  }
  return out;
}

export interface Faq {
  question: LocalizedString;
  answer: LocalizedString;
}

export function getFaqsForGig(_gigId: string): Faq[] {
  return [
    {
      question: { es: '¿Trabajas con clientes fuera de México?', en: 'Do you work with clients outside Mexico?' },
      answer: {
        es: 'Sí, trabajo con clientes de todo el mundo. Comunicación 100% en inglés o español.',
        en: 'Yes, I work with clients worldwide. Communication 100% in English or Spanish.',
      },
    },
    {
      question: { es: '¿Aceptas revisiones después de la entrega?', en: 'Do you accept revisions after delivery?' },
      answer: {
        es: 'Cada paquete incluye un número de revisiones; el premium incluye revisiones ilimitadas.',
        en: 'Each package includes a set number of revisions; premium includes unlimited revisions.',
      },
    },
    {
      question: { es: '¿En qué formato entregas los archivos?', en: 'In which format do you deliver the files?' },
      answer: {
        es: 'Entrego en los formatos estándar de la industria, además del archivo source si tu paquete lo incluye.',
        en: 'I deliver in industry-standard formats, plus the source file if your package includes it.',
      },
    },
    {
      question: { es: '¿Cuál es tu tiempo de respuesta?', en: 'What is your response time?' },
      answer: {
        es: 'Respondo en menos de 2 horas durante horario laboral (GMT-6).',
        en: 'I respond in under 2 hours during business hours (GMT-6).',
      },
    },
  ];
}
