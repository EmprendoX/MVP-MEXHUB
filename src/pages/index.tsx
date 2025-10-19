import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CardItem from '@/components/CardItem';
import Footer from '@/components/Footer';
import type { GetStaticProps } from 'next';
import { getFeaturedListingsForCards } from '@/lib/api/listings';
import type { CardItemListing } from '@/lib/api/listings';

interface HomeProps {
  featuredProducts: CardItemListing[];
}

export default function Home({ featuredProducts }: HomeProps) {
  return (
    <>
      <Head>
        <title>HUBMEX - Fabricantes y Servicios de México para el Mundo</title>
        <meta name="description" content="Conectamos a fabricantes mexicanos con emprendedores y compradores globales. Encuentra productos de calidad, servicios especializados y oportunidades de negocio." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Featured Products Section */}
        <section className="py-20 bg-light-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">
                Productos y Servicios <span className="text-gradient">Destacados</span>
              </h2>
              <p className="text-xl text-text-soft max-w-3xl mx-auto">
                Descubre las mejores oportunidades de manufactura y servicios especializados 
                que México tiene para ofrecer al mundo.
              </p>
            </div>

            {/* Products Grid */}
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <CardItem key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-500/30 rounded-2xl border border-gray-light">
                <h3 className="text-2xl font-semibold text-text-light mb-3">
                  No hay productos destacados disponibles
                </h3>
                <p className="text-text-soft max-w-2xl mx-auto">
                  Estamos trabajando para mostrarte las mejores oportunidades de manufactura. Mientras tanto,
                  explora el catálogo completo para descubrir nuevos proveedores.
                </p>
              </div>
            )}

            {/* View More Button */}
            <div className="text-center mt-12">
              <Link 
                href="/explore" 
                className="btn-primary text-lg px-8 py-3 inline-flex items-center"
              >
                Ver Todos los Productos
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-dark-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">
                ¿Cómo Funciona <span className="text-gradient">HUBMEX</span>?
              </h2>
              <p className="text-xl text-text-soft max-w-3xl mx-auto">
                Conectamos a fabricantes mexicanos con compradores globales en 3 simples pasos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-light mb-4">1. Explora</h3>
                <p className="text-text-soft">
                  Busca productos, servicios y fabricantes por categoría, ubicación o palabras clave.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-light mb-4">2. Conecta</h3>
                <p className="text-text-soft">
                  Contacta directamente con los fabricantes y proveedores que más te interesen.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-light mb-4">3. Negocia</h3>
                <p className="text-text-soft">
                  Establece acuerdos comerciales y haz crecer tu negocio con productos mexicanos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hubmex">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              ¿Eres Fabricante o Proveedor?
            </h2>
            <p className="text-xl text-dark mb-8 opacity-90">
              Únete a nuestra plataforma y conecta con compradores de todo el mundo. 
              Amplía tu mercado y haz crecer tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/publish" className="bg-dark-500 text-primary hover:bg-gray-800 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Publicar Producto
              </Link>
              <Link href="/explore" className="border-2 border-dark-500 text-dark-500 hover:bg-dark-500 hover:text-primary font-medium py-3 px-8 rounded-lg transition-all duration-200">
                Explorar Oportunidades
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const result = await getFeaturedListingsForCards(6);

  if (!result.success) {
    console.error('❌ Error cargando destacados para la página principal:', result.error);
  }

  return {
    props: {
      featuredProducts: result.success && result.data ? result.data : [],
    },
    revalidate: 300, // Revalidar cada 5 minutos para mantener los destacados frescos
  };
};
