'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import CardItem from '@/components/CardItem';
import Footer from '@/components/Footer';
import { getUserProfile } from '@/lib/api/auth';
import { useListings } from '@/lib/hooks/useListings';
import type { User } from '@/types/supabase';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'productos' | 'servicios'>('all');
  
  const { listings, loading: listingsLoading, refreshListings } = useListings({
    userId: typeof id === 'string' ? id : undefined,
    autoFetch: false,
  });

  // Cargar perfil y publicaciones cuando el ID esté disponible
  useEffect(() => {
    async function loadProfileData() {
      if (id && typeof id === 'string') {
        setLoading(true);
        
        // Cargar perfil del usuario
        const userProfile = await getUserProfile(id);
        setProfile(userProfile);
        
        // Cargar publicaciones del usuario
        await refreshListings();
        
        setLoading(false);
      }
    }
    
    loadProfileData();
  }, [id]);

  if (!profile) {
    return (
      <>
        <Head>
          <title>Cargando... - HUBMEX</title>
        </Head>
        <div className="min-h-screen bg-dark-500 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-soft">Cargando perfil...</p>
          </div>
        </div>
      </>
    );
  }

  const filteredListings = listings.filter(listing => {
    if (activeTab === 'all') return true;
    if (activeTab === 'productos') return listing.tipo === 'producto';
    if (activeTab === 'servicios') return listing.tipo === 'servicio';
    return true;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'proveedor': return 'Proveedor';
      case 'comprador': return 'Comprador';
      case 'freelancer': return 'Freelancer';
      default: return tipo;
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'proveedor': return 'bg-primary';
      case 'comprador': return 'bg-success';
      case 'freelancer': return 'bg-gray-light';
      default: return 'bg-gray-light';
    }
  };

  return (
    <>
      <Head>
        <title>{profile.nombre || 'Usuario'} - Perfil en HUBMEX</title>
        <meta name="description" content={`Perfil de ${profile.nombre || 'Usuario'} en HUBMEX. ${(profile.descripcion || '').substring(0, 150)}...`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        {/* Profile Header */}
        <div className="bg-light-bg border-b border-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.nombre || 'Usuario'}
                    width={128}
                    height={128}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-dark text-4xl font-bold">
                    {(profile.nombre || 'U').split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-text-light mb-2">{profile.nombre}</h1>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-dark ${getTypeColor(profile.tipo)}`}>
                        {getTypeLabel(profile.tipo)}
                      </span>
                      <span className="text-text-soft">📍 {profile.ubicacion}</span>
                      <span className="text-text-soft">📅 Miembro desde {formatDate(profile.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="btn-primary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Contactar
                    </button>
                    <button className="btn-outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Seguir
                    </button>
                  </div>
                </div>

                <p className="text-text-soft mb-4 leading-relaxed">{profile.descripcion}</p>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center space-x-6 text-sm text-text-soft">
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      🌐 {profile.website}
                    </a>
                  )}
                  {profile.telefono && (
                    <span>📞 {profile.telefono}</span>
                  )}
                  <span>✉️ {profile.email}</span>
                </div>

                {/* User Type Badge */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm border border-primary capitalize">
                      {profile.tipo}
                    </span>
                    {profile.website && (
                      <span className="px-3 py-1 bg-light-bg text-text-light rounded-full text-sm border border-gray-light">
                        🌐 Sitio web
                      </span>
                    )}
                    {profile.telefono && (
                      <span className="px-3 py-1 bg-light-bg text-text-light rounded-full text-sm border border-gray-light">
                        📞 Teléfono
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-dark-500 border-b border-gray-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{listings.length}</div>
                <div className="text-text-soft text-sm">Publicaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {listings.filter(p => p.tipo === 'producto').length}
                </div>
                <div className="text-text-soft text-sm">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {listings.filter(p => p.tipo === 'servicio').length}
                </div>
                <div className="text-text-soft text-sm">Servicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-text-soft text-sm">Días activo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Publications Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-light mb-4 md:mb-0">
              Productos y Servicios
            </h2>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-light-bg rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-primary text-dark'
                    : 'text-text-soft hover:text-text-light'
                }`}
              >
                Todos ({listings.length})
              </button>
              <button
                onClick={() => setActiveTab('productos')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'productos'
                    ? 'bg-primary text-dark'
                    : 'text-text-soft hover:text-text-light'
                }`}
              >
                Productos ({listings.filter(p => p.tipo === 'producto').length})
              </button>
              <button
                onClick={() => setActiveTab('servicios')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'servicios'
                    ? 'bg-primary text-dark'
                    : 'text-text-soft hover:text-text-light'
                }`}
              >
                Servicios ({listings.filter(p => p.tipo === 'servicio').length})
              </button>
            </div>
          </div>

          {/* Publications Grid */}
          {listingsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-soft">Cargando publicaciones...</p>
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <CardItem
                  key={listing.id}
                  id={listing.id}
                  titulo={listing.titulo}
                  descripcion={listing.descripcion || ''}
                  categoria={listing.categoria || ''}
                  tipo={listing.tipo}
                  precio={listing.precio || undefined}
                  ubicacion={listing.ubicacion || ''}
                  imagenes={listing.imagenes || []}
                  proveedor={{
                    id: profile.id,
                    nombre: profile.nombre || 'Usuario',
                    avatar_url: profile.avatar_url || undefined
                  }}
                  created_at={listing.created_at}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-text-soft mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-semibold text-text-light mb-2">
                No hay publicaciones
              </h3>
              <p className="text-text-soft">
                {activeTab === 'all' 
                  ? 'Este usuario aún no ha publicado ningún producto o servicio.'
                  : `Este usuario no tiene ${activeTab} publicados.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
