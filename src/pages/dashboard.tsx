'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks/useAuth';
import { useListings } from '@/lib/hooks/useListings';

// Datos de ejemplo para el dashboard
const userStats = {
  totalPublications: 8,
  totalMessages: 24,
  totalViews: 156,
  totalContacts: 12
};

const userPublications = [
  {
    id: '1',
    titulo: 'Maquinaria Industrial CNC',
    tipo: 'producto',
    categoria: 'Maquinaria Industrial',
    precio: 2500000,
    vistas: 45,
    contactos: 3,
    estado: 'activo',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    titulo: 'Servicios de Diseño Industrial',
    tipo: 'servicio',
    categoria: 'Servicios de Diseño',
    precio: null,
    vistas: 32,
    contactos: 5,
    estado: 'activo',
    created_at: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    titulo: 'Componentes Electrónicos',
    tipo: 'producto',
    categoria: 'Electrónicos',
    precio: 85000,
    vistas: 28,
    contactos: 2,
    estado: 'activo',
    created_at: '2024-01-13T09:20:00Z'
  }
];

const recentMessages = [
  {
    id: '1',
    sender: 'Carlos Mendoza',
    company: 'AutoParts Solutions',
    preview: 'Hola, estoy interesado en la máquina CNC que tienes publicada...',
    timestamp: '2024-01-27T14:30:00Z',
    unread: true
  },
  {
    id: '2',
    sender: 'María González',
    company: 'Design Co.',
    preview: '¿Podrías enviarme más información sobre los servicios de diseño?',
    timestamp: '2024-01-27T11:15:00Z',
    unread: false
  },
  {
    id: '3',
    sender: 'Roberto Silva',
    company: 'TechMex Industries',
    preview: 'Necesitamos cotización para 1000 componentes electrónicos',
    timestamp: '2024-01-26T16:45:00Z',
    unread: false
  }
];

export default function Dashboard() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { listings, loading: listingsLoading, deleteListing, refreshListings } = useListings({
    userId: user?.id,
    autoFetch: false,  // Cargaremos manualmente cuando el user esté disponible
  });
  
  const [activeTab, setActiveTab] = useState('overview');

  // Proteger ruta: redirigir a login si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Cargar listings cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      refreshListings();
    }
  }, [user]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Consultar';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-soft">Cargando...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (está redirigiendo)
  if (!user) {
    return null;
  }

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-soft text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.includes('primary') ? 'bg-primary bg-opacity-20' : 'bg-success bg-opacity-20'}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Dashboard - HUBMEX</title>
        <meta name="description" content="Panel de control de tu cuenta en HUBMEX. Gestiona tus publicaciones, mensajes y estadísticas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="card">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-dark text-2xl font-bold">U</span>
                  </div>
                  <h2 className="text-xl font-bold text-text-light">{userProfile?.nombre || 'Usuario'}</h2>
                  <p className="text-text-soft text-sm capitalize">{userProfile?.tipo || 'Usuario'}</p>
                  <p className="text-text-soft text-xs">{userProfile?.ubicacion || ''}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-primary text-dark'
                        : 'text-text-soft hover:text-text-light hover:bg-light-bg'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      Resumen
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('publications')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'publications'
                        ? 'bg-primary text-dark'
                        : 'text-text-soft hover:text-text-light hover:bg-light-bg'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Mis Publicaciones
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'messages'
                        ? 'bg-primary text-dark'
                        : 'text-text-soft hover:text-text-light hover:bg-light-bg'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Mensajes
                      {recentMessages.filter(m => m.unread).length > 0 && (
                        <span className="ml-auto bg-alert text-text-light text-xs font-medium px-2 py-1 rounded-full">
                          {recentMessages.filter(m => m.unread).length}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary text-dark'
                        : 'text-text-soft hover:text-text-light hover:bg-light-bg'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Perfil
                    </div>
                  </button>
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-light">
                  <Link href="/publish" className="btn-primary w-full text-center block">
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nueva Publicación
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Publicaciones Activas"
                      value={listings.length}
                      color="text-primary"
                      icon={
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      }
                    />
                    <StatCard
                      title="Mensajes Recibidos"
                      value={userStats.totalMessages}
                      color="text-success"
                      icon={
                        <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      }
                    />
                    <StatCard
                      title="Visitas Totales"
                      value={userStats.totalViews}
                      color="text-primary"
                      icon={
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      }
                    />
                    <StatCard
                      title="Contactos Generados"
                      value={userStats.totalContacts}
                      color="text-success"
                      icon={
                        <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      }
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Publications */}
                    <div className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-light">Publicaciones Recientes</h3>
                        <Link href="#" className="text-primary hover:text-primary-600 text-sm">
                          Ver todas
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {userPublications.slice(0, 3).map((pub) => (
                          <div key={pub.id} className="flex items-center justify-between p-3 bg-light-bg rounded-lg">
                            <div className="flex-1">
                              <p className="text-text-light font-medium text-sm">{pub.titulo}</p>
                              <p className="text-text-soft text-xs">{pub.categoria}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-text-light text-sm">{pub.vistas} vistas</p>
                              <p className="text-text-soft text-xs">{pub.contactos} contactos</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Messages */}
                    <div className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-light">Mensajes Recientes</h3>
                        <Link href="#" className="text-primary hover:text-primary-600 text-sm">
                          Ver todos
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {recentMessages.slice(0, 3).map((msg) => (
                          <div key={msg.id} className={`p-3 rounded-lg ${msg.unread ? 'bg-primary bg-opacity-10' : 'bg-light-bg'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <p className="text-text-light font-medium text-sm">{msg.sender}</p>
                                  {msg.unread && (
                                    <div className="w-2 h-2 bg-alert rounded-full ml-2"></div>
                                  )}
                                </div>
                                <p className="text-text-soft text-xs">{msg.company}</p>
                                <p className="text-text-soft text-xs mt-1 line-clamp-2">{msg.preview}</p>
                              </div>
                              <p className="text-text-soft text-xs ml-2">
                                {formatDate(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'publications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-light">Mis Publicaciones</h2>
                    <Link href="/publish" className="btn-primary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Nueva Publicación
                    </Link>
                  </div>

                  <div className="card">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-light">
                            <th className="text-left py-3 px-4 text-text-light font-medium">Producto/Servicio</th>
                            <th className="text-left py-3 px-4 text-text-light font-medium">Categoría</th>
                            <th className="text-left py-3 px-4 text-text-light font-medium">Precio</th>
                            <th className="text-left py-3 px-4 text-text-light font-medium">Vistas</th>
                            <th className="text-left py-3 px-4 text-text-light font-medium">Contactos</th>
                            <th className="text-left py-3 px-4 text-text-light font-medium">Estado</th>
                            <th className="text-left py-3 px-4 text-text-light font-medium">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listingsLoading ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-text-soft">
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                                  Cargando publicaciones...
                                </div>
                              </td>
                            </tr>
                          ) : listings.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-text-soft">
                                No tienes publicaciones aún. <Link href="/publish" className="text-primary">Crea tu primera publicación</Link>
                              </td>
                            </tr>
                          ) : (
                            listings.map((listing) => (
                              <tr key={listing.id} className="border-b border-gray-light">
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="text-text-light font-medium">{listing.titulo}</p>
                                    <p className="text-text-soft text-sm">{listing.tipo}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-text-soft">{listing.categoria || '-'}</td>
                                <td className="py-3 px-4 text-text-light">{formatPrice(listing.precio)}</td>
                                <td className="py-3 px-4 text-text-soft">-</td>
                                <td className="py-3 px-4 text-text-soft">-</td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-success bg-opacity-20 text-success">
                                    activo
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <button className="text-primary hover:text-primary-600 text-sm">
                                      Editar
                                    </button>
                                    <button 
                                      className="text-alert hover:text-red-600 text-sm"
                                      onClick={async () => {
                                        if (confirm('¿Estás seguro de eliminar esta publicación?')) {
                                          const result = await deleteListing(listing.id);
                                          if (result.success) {
                                            alert('Publicación eliminada exitosamente');
                                          } else {
                                            alert(result.error || 'Error al eliminar');
                                          }
                                        }
                                      }}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-text-light">Mensajes</h2>
                  
                  <div className="space-y-4">
                    {recentMessages.map((msg) => (
                      <div key={msg.id} className={`card ${msg.unread ? 'border-l-4 border-primary' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-dark font-medium">
                                {msg.sender.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h3 className="text-text-light font-medium">{msg.sender}</h3>
                                <span className="text-text-soft text-sm ml-2">• {msg.company}</span>
                                {msg.unread && (
                                  <span className="ml-2 bg-alert text-text-light text-xs font-medium px-2 py-1 rounded-full">
                                    Nuevo
                                  </span>
                                )}
                              </div>
                              <p className="text-text-soft text-sm mt-1">{msg.preview}</p>
                              <p className="text-text-soft text-xs mt-2">{formatDate(msg.timestamp)}</p>
                            </div>
                          </div>
                          <button className="btn-outline text-sm">
                            Responder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-text-light">Mi Perfil</h2>
                  
                  <div className="card">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-text-light font-medium mb-2">
                            Nombre de la Empresa
                          </label>
                          <input
                            type="text"
                            defaultValue="MetalWorks México"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-text-light font-medium mb-2">
                            Tipo de Usuario
                          </label>
                          <select className="select-field">
                            <option value="proveedor">Proveedor</option>
                            <option value="comprador">Comprador</option>
                            <option value="freelancer">Freelancer</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-text-light font-medium mb-2">
                          Descripción
                        </label>
                        <textarea
                          defaultValue="Empresa especializada en maquinaria industrial CNC y servicios de fabricación de precisión."
                          className="textarea-field h-24"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-text-light font-medium mb-2">
                            Ubicación
                          </label>
                          <input
                            type="text"
                            defaultValue="Guadalajara, Jalisco"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-text-light font-medium mb-2">
                            Sitio Web
                          </label>
                          <input
                            type="url"
                            defaultValue="https://metalworksmexico.com"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button type="button" className="btn-outline">
                          Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                          Guardar Cambios
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
