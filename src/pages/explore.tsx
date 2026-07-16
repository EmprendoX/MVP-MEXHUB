import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CardItem from '@/components/CardItem';
import { listGigs } from '@/lib/mock/gigs';
import type { Gig } from '@/types/gig';
import type { GetStaticPropsContext } from 'next';
import { useTranslation } from '@/contexts/TranslationContext';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

interface ExploreProps {
  gigs: Gig[];
}

type SortKey = 'recommended' | 'newest' | 'price_low' | 'price_high' | 'rating';

const PRICE_MAX = 50000;

export default function Explore({ gigs: initialGigs }: ExploreProps) {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX);
  const [deliveryMax, setDeliveryMax] = useState<number>(30);
  const [ratingMin, setRatingMin] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>('recommended');

  useEffect(() => {
    if (typeof router.query.q === 'string') setSearchQuery(router.query.q);
  }, [router.query.q]);

  const filtered = useMemo(() => {
    let list = [...initialGigs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.titulo.toLowerCase().includes(q) ||
          g.descripcion.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategories.length > 0) {
      list = list.filter((g) => selectedCategories.includes(g.categoria));
    }
    if (priceMax < PRICE_MAX) list = list.filter((g) => g.precio_desde <= priceMax);
    if (deliveryMax < 30) list = list.filter((g) => g.dias_entrega_min <= deliveryMax);
    if (ratingMin > 0) list = list.filter((g) => g.rating >= ratingMin);

    switch (sort) {
      case 'newest':
        list.sort((a, b) => b.created_at.localeCompare(a.created_at));
        break;
      case 'price_low':
        list.sort((a, b) => a.precio_desde - b.precio_desde);
        break;
      case 'price_high':
        list.sort((a, b) => b.precio_desde - a.precio_desde);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => b.total_ordenes - a.total_ordenes);
    }
    return list;
  }, [initialGigs, searchQuery, selectedCategories, priceMax, deliveryMax, ratingMin, sort]);

  const uniqueCategories = useMemo(
    () => Array.from(new Set(initialGigs.map((g) => g.categoria))),
    [initialGigs]
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceMax(PRICE_MAX);
    setDeliveryMax(30);
    setRatingMin(0);
    setSearchQuery('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      { pathname: '/explore', query: searchQuery ? { q: searchQuery } : {} },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <Head>
        <title>Explorar servicios · HUBMEX</title>
        <meta name="description" content="Encuentra freelancers y servicios profesionales en México." />
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        {/* Search header */}
        <div className="bg-light-bg border-b border-gray-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tCommon('navbar.searchPlaceholder')}
                  className="input-field w-full pl-12"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-text-soft text-sm">
                {filtered.length} servicio{filtered.length === 1 ? '' : 's'}
                {searchQuery && ` para "${searchQuery}"`}
              </p>
              <div className="flex items-center gap-2 text-sm text-text-soft">
                <span>Ordenar por</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-dark-500 border border-gray-light/30 rounded px-3 py-1 text-text-light"
                >
                  <option value="recommended">Recomendados</option>
                  <option value="newest">Más recientes</option>
                  <option value="price_low">Precio menor</option>
                  <option value="price_high">Precio mayor</option>
                  <option value="rating">Mejor calificados</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex max-w-7xl mx-auto">
          {/* Filters sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0 p-6 border-r border-gray-light/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-light font-semibold">Filtros</h2>
              <button onClick={clearFilters} className="text-primary text-xs hover:underline">
                Limpiar
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-text-light font-medium mb-2 text-sm">Categoría</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {uniqueCategories.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm text-text-soft cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggleCategory(c)}
                        className="rounded border-gray-light bg-dark-500 text-primary focus:ring-primary"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-text-light font-medium mb-2 text-sm">
                  Precio máximo: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(priceMax)}
                </h3>
                <input
                  type="range"
                  min={200}
                  max={PRICE_MAX}
                  step={200}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <h3 className="text-text-light font-medium mb-2 text-sm">
                  Entrega en máx. {deliveryMax}d
                </h3>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={deliveryMax}
                  onChange={(e) => setDeliveryMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <h3 className="text-text-light font-medium mb-2 text-sm">Rating mínimo</h3>
                <div className="flex gap-1">
                  {[0, 3, 4, 4.5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRatingMin(v)}
                      className={`flex-1 py-1 rounded text-xs border transition-colors ${
                        ratingMin === v
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-gray-light/30 text-text-soft hover:text-text-light'
                      }`}
                    >
                      {v === 0 ? 'Todos' : `${v}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 p-6">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((g) => (
                  <CardItem
                    key={g.id}
                    id={g.id}
                    slug={g.slug}
                    titulo={g.titulo}
                    descripcion={g.descripcion}
                    categoria={g.categoria}
                    tipo="servicio"
                    precio={g.precio_desde}
                    imagenes={g.imagenes}
                    proveedor={{
                      id: g.seller.id,
                      nombre: g.seller.nombre,
                      avatar_url: g.seller.avatar_url,
                      nivel: g.seller.nivel,
                    }}
                    rating={g.rating}
                    total_reviews={g.total_reviews}
                    dias_entrega_min={g.dias_entrega_min}
                    created_at={g.created_at}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-text-light mb-2">Sin resultados</h3>
                <p className="text-text-soft mb-6">Ajusta tus filtros o cambia tu búsqueda.</p>
                <button onClick={clearFilters} className="btn-primary">Limpiar filtros</button>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common', 'explore']);
  return {
    props: {
      gigs: listGigs(),
      translations,
    },
  };
}

