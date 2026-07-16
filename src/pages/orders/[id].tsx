import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderById, mockOrders } from '@/lib/mock/gigs';
import type { Order, OrderStatus } from '@/types/gig';
import { loadTranslations } from '@/lib/i18n/loadTranslations';

interface OrderDetailProps {
  order: Order;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  in_revision: 'En revisión',
  delivered: 'Entregada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const TIER_LABEL = { basico: 'Básico', estandar: 'Estándar', premium: 'Premium' };

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Creada' },
  { key: 'in_progress', label: 'En progreso' },
  { key: 'delivered', label: 'Entregada' },
  { key: 'completed', label: 'Completada' },
];

function formatMoney(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(n);
}

function stepIndex(status: OrderStatus): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderDetailPage({ order }: OrderDetailProps) {
  const currentStep = stepIndex(order.estado);
  const isDelivered = order.estado === 'delivered';
  const isCompleted = order.estado === 'completed';
  const isActive = order.estado === 'pending' || order.estado === 'in_progress';

  return (
    <>
      <Head>
        <title>Orden {order.id} · HUBMEX</title>
      </Head>

      <div className="min-h-screen bg-dark-500">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/orders" className="text-primary text-sm hover:underline mb-4 inline-block">
            ← Volver a mis órdenes
          </Link>

          {/* Header */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={order.gig_imagen} alt={order.gig_titulo} fill className="object-cover" sizes="96px" />
                </div>
                <div>
                  <div className="text-text-soft text-xs mb-1">Orden #{order.id}</div>
                  <h1 className="text-lg font-semibold text-text-light mb-1">{order.gig_titulo}</h1>
                  <div className="text-text-soft text-sm">
                    Paquete <span className="text-text-light">{TIER_LABEL[order.paquete]}</span>
                    {' · '}
                    Vendedor <span className="text-text-light">{order.seller_nombre}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-text-soft text-xs">Total</div>
                <div className="text-text-light font-bold text-2xl">{formatMoney(order.precio)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress bar */}
              <div className="card">
                <h2 className="text-lg font-semibold text-text-light mb-6">Estado de la orden</h2>
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    return (
                      <div key={step.key} className="flex-1 flex items-center last:flex-initial">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              done ? 'bg-primary text-dark' : 'bg-gray-light/20 text-text-soft'
                            }`}
                          >
                            {done ? '✓' : i + 1}
                          </div>
                          <div
                            className={`mt-2 text-xs whitespace-nowrap ${
                              done ? 'text-text-light' : 'text-text-soft'
                            }`}
                          >
                            {step.label}
                          </div>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 ${
                              i < currentStep ? 'bg-primary' : 'bg-gray-light/20'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements */}
              {order.requerimientos && (
                <div className="card space-y-2">
                  <h2 className="text-lg font-semibold text-text-light">Requerimientos enviados</h2>
                  <p className="text-text-soft text-sm whitespace-pre-line">{order.requerimientos}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="card space-y-4">
                <h2 className="text-lg font-semibold text-text-light">Actividad</h2>
                <ol className="relative border-l-2 border-gray-light/30 ml-3 space-y-6">
                  {order.timeline.map((ev, i) => (
                    <li key={i} className="ml-6">
                      <span className="absolute -left-2 w-4 h-4 rounded-full bg-primary" />
                      <div className="text-text-light font-medium text-sm">{ev.titulo}</div>
                      {ev.descripcion && (
                        <div className="text-text-soft text-sm mt-1">{ev.descripcion}</div>
                      )}
                      <time className="text-text-soft text-xs mt-1 block">
                        {new Date(ev.fecha).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div className="card space-y-4 lg:sticky lg:top-6">
                <div>
                  <div className="text-text-soft text-xs uppercase tracking-wide">Estado</div>
                  <div className="text-text-light font-semibold text-lg">{STATUS_LABEL[order.estado]}</div>
                </div>
                <div>
                  <div className="text-text-soft text-xs uppercase tracking-wide">Entrega estimada</div>
                  <div className="text-text-light font-medium">
                    {new Date(order.fecha_entrega_estimada).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                <div className="border-t border-gray-light/30 pt-4 space-y-3">
                  {isActive && (
                    <>
                      <button className="btn-outline w-full">Enviar mensaje</button>
                      <button className="w-full text-alert text-sm hover:underline">
                        Solicitar cancelación
                      </button>
                    </>
                  )}
                  {isDelivered && (
                    <>
                      <button className="btn-primary w-full">Aprobar entrega</button>
                      <button className="btn-outline w-full">Solicitar revisión</button>
                    </>
                  )}
                  {isCompleted && (
                    <button className="btn-outline w-full">Comprar de nuevo</button>
                  )}
                </div>

                <div className="border-t border-gray-light/30 pt-4">
                  <div className="text-text-soft text-xs mb-2">Vendedor</div>
                  <Link href={`/profile/${order.seller_id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                      {order.seller_avatar && (
                        <Image src={order.seller_avatar} alt={order.seller_nombre} width={40} height={40} className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="text-text-light font-medium text-sm group-hover:text-primary">
                        {order.seller_nombre}
                      </div>
                      <div className="text-text-soft text-xs">Ver perfil</div>
                    </div>
                  </Link>
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

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: mockOrders.map((o) => ({ params: { id: o.id } })),
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<OrderDetailProps> = async ({
  params,
  locale,
}: GetStaticPropsContext) => {
  const id = params?.id as string;
  const order = getOrderById(id);
  if (!order) return { notFound: true };

  const translations = await loadTranslations(locale, ['common']);
  return { props: { order, translations } };
};
