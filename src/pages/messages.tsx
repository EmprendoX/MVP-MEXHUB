'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMessages } from '@/lib/hooks/useMessages';
import type { Message } from '@/types/supabase';
import type { ConversationSummary } from '@/lib/api/messages';


export default function Messages() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    conversations, 
    messages, 
    loading: messagesLoading, 
    error: messagesError,
    sendMessage,
    selectConversation,
    currentConversationId
  } = useMessages();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  // Proteger ruta: redirigir a login si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Manejar query params para iniciar conversación
  useEffect(() => {
    const { userId } = router.query;
    if (userId && typeof userId === 'string') {
      setTargetUserId(userId);
      
      // Buscar conversación existente con este usuario
      const existingConversation = conversations.find(conv => 
        conv.user.id === userId
      );
      
      if (existingConversation) {
        // Si existe la conversación, seleccionarla
        setSelectedConversation(existingConversation.id);
        selectConversation(existingConversation.id);
      } else {
        // Si no existe, preparar para crear una nueva conversación
        setSelectedConversation(null);
      }
      
      // Limpiar query params después de procesarlos
      router.replace('/messages', undefined, { shallow: true });
    }
  }, [router.query, conversations, selectConversation, router]);

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages; // Usar mensajes reales del hook
  
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
  // Los mensajes ahora vienen del hook useMessages

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('es-MX', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('es-MX', { 
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (selectedConversation) {
        // Enviar mensaje a conversación existente
        const result = await sendMessage(selectedConversation, newMessage);
        if (result.success) {
          setNewMessage('');
        } else {
          console.error('Error enviando mensaje:', result.error);
        }
      } else if (targetUserId) {
        // Crear nueva conversación enviando primer mensaje
        const result = await sendMessage(targetUserId, newMessage);
        if (result.success) {
          setNewMessage('');
          // La conversación se creará automáticamente
        } else {
          console.error('Error enviando mensaje:', result.error);
        }
      }
    }
  };

  const ConversationItem = ({ conversation }: { conversation: ConversationSummary }) => (
    <div
      onClick={() => {
        setSelectedConversation(conversation.id);
        selectConversation(conversation.id);
        setIsMobileView(false);
      }}
      className={`p-4 cursor-pointer transition-colors duration-200 ${
        selectedConversation === conversation.id
          ? 'bg-primary bg-opacity-20 border-r-2 border-primary'
          : 'hover:bg-light-bg'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-dark font-medium text-sm">
            {conversation.user.nombre?.split(' ').map(n => n[0]).join('') || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-text-light font-medium truncate">
              {conversation.user.nombre || 'Usuario'}
            </h3>
            <span className="text-text-soft text-xs">
              {formatTime(conversation.lastMessage.created_at)}
            </span>
          </div>
          <p className="text-text-soft text-sm truncate mt-1">
            {conversation.lastMessage.contenido}
          </p>
          {conversation.unreadCount > 0 && (
            <div className="flex justify-end mt-2">
              <span className="bg-primary text-dark text-xs font-medium px-2 py-1 rounded-full">
                {conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message }: { message: Message }) => {
    const isOwn = message.sender_id === user?.id;
    
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-primary text-dark' 
            : 'bg-light-bg text-text-light'
        }`}>
          <p className="text-sm">{message.contenido}</p>
          <p className={`text-xs mt-1 ${
            isOwn ? 'text-dark opacity-70' : 'text-text-soft'
          }`}>
            {formatTime(message.created_at)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Mensajes - HUBMEX</title>
        <meta name="description" content="Mensajería interna de HUBMEX. Conecta con fabricantes y compradores." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-500">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div className="flex h-[calc(100vh-64px)]">
          {/* Conversations Sidebar - Desktop */}
          <div className="hidden md:block w-80 bg-light-bg border-r border-gray-light">
            <div className="p-4 border-b border-gray-light">
              <h2 className="text-xl font-bold text-text-light">Mensajes</h2>
              <p className="text-text-soft text-sm">
                {conversations.length} conversaciones
              </p>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {messagesLoading ? (
                <div className="p-4 text-center text-text-soft">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  Cargando conversaciones...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-text-soft">
                  No tienes conversaciones aún
                </div>
              ) : (
                conversations.map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="bg-light-bg border-b border-gray-light p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setIsMobileView(true)}
                      className="md:hidden p-2 text-text-soft hover:text-text-light"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark font-medium">
                        {selectedConv.user.nombre?.split(' ').map(n => n[0]).join('') || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-text-light font-medium">{selectedConv.user.nombre || 'Usuario'}</h3>
                      <p className="text-text-soft text-sm">Usuario</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-text-soft hover:text-text-light">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button className="p-2 text-text-soft hover:text-text-light">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-text-soft">Cargando mensajes...</p>
                      </div>
                    </div>
                  ) : currentMessages.length > 0 ? (
                    currentMessages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-text-soft mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-text-soft">No hay mensajes en esta conversación</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="bg-light-bg border-t border-gray-light p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 input-field"
                    />
                    <button
                      type="submit"
                      className="btn-primary px-6"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : targetUserId ? (
              /* New Conversation with Target User */
              <>
                {/* Chat Header for New Conversation */}
                <div className="bg-light-bg border-b border-gray-light p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setIsMobileView(true)}
                      className="md:hidden p-2 text-text-soft hover:text-text-light"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark font-medium">U</span>
                    </div>
                    <div>
                      <h3 className="text-text-light font-medium">Nueva conversación</h3>
                      <p className="text-text-soft text-sm">Inicia una conversación</p>
                    </div>
                  </div>
                </div>

                {/* New Conversation Messages Area */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-text-light mb-2">
                      Inicia la conversación
                    </h3>
                    <p className="text-text-soft mb-6">
                      Envía tu primer mensaje para comenzar una nueva conversación
                    </p>
                  </div>
                </div>

                {/* Message Input for New Conversation */}
                <div className="bg-light-bg border-t border-gray-light p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 bg-dark-500 border border-gray-light rounded-lg px-4 py-3 text-text-light placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-primary text-dark px-6 py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-text-soft mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-text-light mb-2">
                    Selecciona una conversación
                  </h3>
                  <p className="text-text-soft">
                    Elige una conversación de la lista para comenzar a chatear
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Conversations Modal */}
        {isMobileView && (
          <div className="md:hidden fixed inset-0 z-50 bg-dark-500">
            <div className="p-4 border-b border-gray-light">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-light">Mensajes</h2>
                <button
                  onClick={() => setIsMobileView(false)}
                  className="p-2 text-text-soft hover:text-text-light"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {messagesLoading ? (
                <div className="p-4 text-center text-text-soft">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  Cargando conversaciones...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-text-soft">
                  No tienes conversaciones aún
                </div>
              ) : (
                conversations.map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
