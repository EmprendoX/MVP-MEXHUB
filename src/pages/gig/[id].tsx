import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getGigById, mockGigs } from '@/lib/mock/gigs';
import type { Gig, GigPackage, PackageTier } from '@/types/gig';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

interface GigPageProps {
  gig: Gig;
}

const TIER_ORDER: PackageTier[] = ['basico', 'estandar', 'premium'];

const NIVEL_LABELS: Record<Gig['seller']['nivel'], string> = {
  nuevo: 'Nuevo',
  nivel_1: 'Nivel 1',
  nivel_2: 'Nivel 2',
  top_rated: 'Top Rated',
};

function formatMoney(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function StarRow({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`${cls} ${n <= Math.round(value) ? 'text-yellow-400' : 'text-gray-light/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.363 1.118l1.287 3.958c.3.922-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.175 0l-3.37 2.45c-.784.57-1.838-.196-1.539-1.118l1.286-3.958a1 1 0 00-.362-1.118L2.05 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
        </svg>
      ))}
    </div>
  );
}

function PackageCard({ pkg, active }: { pkg: GigPackage; active: boolean }) {
  return (
    <div className={`space-y-4 ${active ? '' : 'hidden'}`}>
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-text-light font-semibold text-lg">{pkg.nombre}</div>
          <div className="text-text-soft text-sm">{pkg.descripcion}</div>
        </div>
        <div className="text-text-light font-bold text-2xl">{formatMoney(pkg.precio)}</div>
      </div>

      <div className="flex items-center gap-6 text-text-soft text-sm border-y border-gray-light/30 py-3">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {pkg.dias_entrega} {pkg.dias_entrega === 1 ? 'día' : 'días'}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {pkg.revisiones === 'ilimitadas' ? 'Revisiones ilimitadas' : `${pkg.revisiones} revisiones`}
        </span>
      </div>

      <ul className="space-y-2">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-text-light text-sm">
            <svg className="w-4 h-4 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <button className="btn-primary w-full py-3 flex items-center justify-center gap-2">
        Continuar ({formatMoney(pkg.precio)})
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button className="btn-outline w-full py-2 text-sm">Contactar al vendedor</button>
    </div>
  );
}

export default function GigDetailPage({ gig }: GigPageProps) {
  const router = useRouter();
  const [activeTier, setActiveTier] = useState<PackageTier>('estandar');
  const [activeImage, setActiveImage] = useState(0);

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{gig.titulo} · HUBMEX</title>
        <meta name="description" content={gig.descripcion.slice(0, 160)} />
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-text-soft text-sm mb-6 flex items-center gap-2">
            <Link href="/explore" className="hover:text-primary">Explorar</Link>
            <span>/</span>
            <span>{gig.categoria}</span>
            <span>/</span>
            <span className="text-text-light">{gig.subcategoria}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAIN COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-light mb-4 leading-tight">
                  {gig.titulo}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                      {gig.seller.avatar_url && (
                        <Image
                          src={gig.seller.avatar_url}
                          alt={gig.seller.nombre}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-text-light font-semibold text-sm">{gig.seller.nombre}</div>
                      <div className="text-primary text-xs">{NIVEL_LABELS[gig.seller.nivel]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <StarRow value={gig.rating} />
                    <span className="text-text-light font-semibold">{gig.rating.toFixed(1)}</span>
                    <span className="text-text-soft">({gig.total_reviews})</span>
                  </div>
                  <span className="text-text-soft text-sm">·  {gig.total_ordenes} órdenes</span>
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-light-bg">
                  <Image
                    src={gig.imagenes[activeImage]}
                    alt={gig.titulo}
                    fill
                    sizes="(max-width:1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                </div>
                {gig.imagenes.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {gig.imagenes.map((img, i) => (
                      <button
                        key={img}
                        onClick={() => setActiveImage(i)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          i === activeImage ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} alt="" fill sizes="20vw" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* About */}
              <section className="card space-y-4">
                <h2 className="text-xl font-semibold text-text-light">Acerca de este servicio</h2>
                <p className="text-text-soft leading-relaxed whitespace-pre-line">{gig.descripcion}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {gig.tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-dark-500 text-text-soft border border-gray-light/40">
                      #{t}
                    </span>
                  ))}
                </div>
              </section>

              {/* About seller */}
              <section className="card space-y-4">
                <h2 className="text-xl font-semibold text-text-light">Sobre el vendedor</h2>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                    {gig.seller.avatar_url && (
                      <Image
                        src={gig.seller.avatar_url}
                        alt={gig.seller.nombre}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-text-light font-bold text-lg">{gig.seller.nombre}</div>
                    <div className="text-text-soft text-sm mb-2">{gig.seller.descripcion}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarRow value={gig.seller.rating} />
                      <span className="text-text-light font-semibold">{gig.seller.rating.toFixed(1)}</span>
                      <span className="text-text-soft">({gig.seller.total_reviews} reseñas)</span>
                    </div>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-light/30 text-sm">
                  <div>
                    <dt className="text-text-soft">Desde</dt>
                    <dd className="text-text-light font-medium">{gig.seller.ubicacion}</dd>
                  </div>
                  <div>
                    <dt className="text-text-soft">Miembro desde</dt>
                    <dd className="text-text-light font-medium">{new Date(gig.seller.miembro_desde).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}</dd>
                  </div>
                  <div>
                    <dt className="text-text-soft">Idiomas</dt>
                    <dd className="text-text-light font-medium">{gig.seller.idiomas.join(', ')}</dd>
                  </div>
                  <div>
                    <dt className="text-text-soft">Responde en</dt>
                    <dd className="text-text-light font-medium">{gig.seller.responde_en}</dd>
                  </div>
                </dl>
              </section>

              {/* FAQ */}
              {gig.faq.length > 0 && (
                <section className="card space-y-4">
                  <h2 className="text-xl font-semibold text-text-light">Preguntas frecuentes</h2>
                  <div className="divide-y divide-gray-light/30">
                    {gig.faq.map((f) => (
                      <details key={f.pregunta} className="py-3 group">
                        <summary className="flex items-center justify-between cursor-pointer text-text-light font-medium">
                          {f.pregunta}
                          <svg className="w-4 h-4 text-text-soft transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <p className="mt-2 text-text-soft text-sm">{f.respuesta}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
              <section className="card space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text-light">
                    Reseñas ({gig.total_reviews})
                  </h2>
                  <div className="flex items-center gap-2">
                    <StarRow value={gig.rating} size="md" />
                    <span className="text-text-light font-bold text-lg">{gig.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {gig.reviews.length === 0 && (
                    <p className="text-text-soft text-sm">Este servicio aún no tiene reseñas.</p>
                  )}
                  {gig.reviews.map((r) => (
                    <div key={r.id} className="border-b border-gray-light/30 pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                          {r.autor_avatar && (
                            <Image src={r.autor_avatar} alt={r.autor_nombre} width={40} height={40} className="object-cover" />
                          )}
                        </div>
                        <div>
                          <div className="text-text-light font-medium text-sm">{r.autor_nombre}</div>
                          <div className="text-text-soft text-xs">{r.autor_pais}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                          <StarRow value={r.rating} />
                          <span className="text-text-light text-sm font-medium">{r.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-text-soft text-sm leading-relaxed">{r.comentario}</p>
                      <div className="text-text-soft text-xs mt-2">
                        {new Date(r.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* SIDEBAR — Package selector */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <div className="card">
                  <div className="flex border-b border-gray-light/30 mb-4">
                    {TIER_ORDER.map((tier) => {
                      const pkg = gig.paquetes[tier];
                      const isActive = activeTier === tier;
                      return (
                        <button
                          key={tier}
                          onClick={() => setActiveTier(tier)}
                          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                            isActive
                              ? 'text-primary border-b-2 border-primary'
                              : 'text-text-soft hover:text-text-light'
                          }`}
                        >
                          {pkg.nombre}
                        </button>
                      );
                    })}
                  </div>
                  {TIER_ORDER.map((tier) => (
                    <PackageCard key={tier} pkg={gig.paquetes[tier]} active={activeTier === tier} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: mockGigs.flatMap((g) => [
      { params: { id: g.id } },
      { params: { id: g.slug } },
    ]),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<GigPageProps> = async ({
  params,
  locale,
}: GetStaticPropsContext) => {
  const id = params?.id as string;
  const gig = getGigById(id);

  if (!gig) {
    return { notFound: true };
  }

  const translations = await loadTranslations(locale, ['common']);

  return {
    props: {
      gig,
      translations,
    },
  };
};
