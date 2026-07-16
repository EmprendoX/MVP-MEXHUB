import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { listOrders } from '@/lib/mock/gigs';
import type { Order, OrderStatus } from '@/types/gig';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

interface OrdersPageProps {
  orders: Order[];
}

type Tab = 'activas' | 'entregadas' | 'completadas' | 'todas';

const TABS: { id: Tab; label: string; states: OrderStatus[] }[] = [
  { id: 'activas', label: 'Activas', states: ['pending', 'in_progress', 'in_revision'] },
  { id: 'entregadas', label: 'Entregadas', states: ['delivered'] },
  { id: 'completadas', label: 'Completadas', states: ['completed'] },
  { id: 'todas', label: 'Todas', states: ['pending', 'in_progress', 'in_revision', 'delivered', 'completed', 'cancelled'] },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  in_revision: 'En revisión',
  delivered: 'Entregada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-primary/20 text-primary',
  in_revision: 'bg-orange-500/20 text-orange-400',
  delivered: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-alert/20 text-alert',
};

const TIER_LABEL = { basico: 'Básico', estandar: 'Estándar', premium: 'Premium' };

function formatMoney(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(n);
}

export default function OrdersPage({ orders }: OrdersPageProps) {
  const [tab, setTab] = useState<Tab>('activas');
  const activeStates = TABS.find((t) => t.id === tab)!.states;
  const filtered = orders.filter((o) => activeStates.includes(o.estado));

  return (
    <>
      <Head>
        <title>Mis órdenes · HUBMEX</title>
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-light mb-1">Mis órdenes</h1>
            <p className="text-text-soft">Gestiona las compras que realizaste como comprador.</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-light/30 mb-6">
            <nav className="flex gap-1 -mb-px overflow-x-auto">
              {TABS.map((t) => {
                const count = orders.filter((o) => t.states.includes(o.estado)).length;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      active
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-soft hover:text-text-light'
                    }`}
                  >
                    {t.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${active ? 'bg-primary/20' : 'bg-gray-light/20'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <svg className="w-16 h-16 text-text-soft mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-text-soft mb-4">No tienes órdenes en esta categoría todavía.</p>
              <Link href="/explore" className="btn-primary inline-block">Explorar servicios</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((o) => (
                <Link
                  key={o.id}
                  href={`/orders/${o.id}`}
                  className="card flex gap-4 items-center hover:border-primary transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={o.gig_imagen} alt={o.gig_titulo} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_STYLES[o.estado]}`}>
                        {STATUS_LABEL[o.estado]}
                      </span>
                      <span className="text-text-soft text-xs">Paquete {TIER_LABEL[o.paquete]}</span>
                    </div>
                    <h3 className="text-text-light font-medium truncate">{o.gig_titulo}</h3>
                    <div className="text-text-soft text-sm mt-1">
                      Vendedor: <span className="text-text-light">{o.seller_nombre}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-text-light font-bold">{formatMoney(o.precio)}</div>
                    <div className="text-text-soft text-xs mt-1">
                      Entrega: {new Date(o.fecha_entrega_estimada).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const translations = await loadTranslations(locale, ['common']);
  return { props: { orders: listOrders(), translations } };
}
