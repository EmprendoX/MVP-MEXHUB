/**
 * HOOK DE MENSAJERÍA - HUBMEX MVP
 * 
 * Custom hook para manejar mensajería en componentes React
 * Proporciona estado, funciones CRUD y real-time subscriptions
 * 
 * Uso:
 * const { conversations, messages, loading, sendMessage, refreshConversations } = useMessages();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as messagesApi from '@/lib/api/messages';
import type { Message } from '@/types/supabase';
import type { ConversationSummary } from '@/lib/api/messages';

interface UseMessagesOptions {
  autoFetch?: boolean; // Si es true, carga conversaciones al montar
}

export function useMessages(options?: UseMessagesOptions) {
  const { autoFetch = true } = options || {};
  
  // Estados principales
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de la conversación actual
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Referencias para real-time subscriptions
  const messageSubscriptionRef = useRef<(() => void) | null>(null);
  const conversationSubscriptionRef = useRef<(() => void) | null>(null);

  // =========================================================================
  // FUNCIONES DE CARGA DE DATOS
  // =========================================================================

  /**
   * Cargar lista de conversaciones
   */
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await messagesApi.getConversationsList();
      
      if (result.success && result.data) {
        setConversations(result.data);
      } else {
        setError(result.error || 'Error al cargar conversaciones.');
        setConversations([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado al cargar conversaciones.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar mensajes de una conversación específica
   */
  const fetchMessages = useCallback(async (otherUserId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await messagesApi.getConversationMessages(otherUserId);
      
      if (result.success && result.data) {
        setMessages(result.data);
        setCurrentConversationId(otherUserId);
      } else {
        setError(result.error || 'Error al cargar mensajes.');
        setMessages([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado al cargar mensajes.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================================
  // FUNCIONES DE ACCIÓN
  // =========================================================================

  /**
   * Enviar un nuevo mensaje
   */
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!content.trim()) {
      setError('El mensaje no puede estar vacío.');
      return { success: false, error: 'El mensaje no puede estar vacío.' };
    }

    setLoading(true);
    
    try {
      const result = await messagesApi.createMessage({
        sender_id: '', // Se llenará automáticamente en la API
        receiver_id: receiverId,
        contenido: content.trim(),
      });

      if (result.success && result.data) {
        // Agregar el mensaje a la lista local inmediatamente
        setMessages(prev => [...prev, result.data!]);
        
        // Refrescar la lista de conversaciones para actualizar el último mensaje
        await fetchConversations();
        
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al enviar mensaje.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado al enviar mensaje.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchConversations]);

  /**
   * Marcar mensajes como leídos
   */
  const markAsRead = useCallback(async (messageIds: string[]) => {
    try {
      const result = await messagesApi.markMessagesAsRead(messageIds);
      
      if (result.success) {
        // Actualizar estado local si es necesario
        console.log('Mensajes marcados como leídos:', messageIds);
      }
      
      return result;
    } catch (err: any) {
      console.error('Error marcando mensajes como leídos:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // =========================================================================
  // REAL-TIME SUBSCRIPTIONS
  // =========================================================================

  /**
   * Suscribirse a mensajes en tiempo real para la conversación actual
   */
  const subscribeToCurrentConversation = useCallback((otherUserId: string) => {
    // Limpiar suscripción anterior si existe
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current();
      messageSubscriptionRef.current = null;
    }

    // Crear nueva suscripción
    const unsubscribe = messagesApi.subscribeToMessages(otherUserId, (newMessage: Message) => {
      console.log('Nuevo mensaje recibido:', newMessage);
      
      // Agregar el mensaje a la lista local
      setMessages(prev => {
        // Evitar duplicados
        if (prev.some(msg => msg.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      // Refrescar conversaciones para actualizar el último mensaje
      fetchConversations();
    });

    messageSubscriptionRef.current = unsubscribe;
  }, [fetchConversations]);

  /**
   * Suscribirse a nuevas conversaciones
   */
  const subscribeToNewConversations = useCallback(() => {
    // Limpiar suscripción anterior si existe
    if (conversationSubscriptionRef.current) {
      conversationSubscriptionRef.current();
      conversationSubscriptionRef.current = null;
    }

    // Crear nueva suscripción
    const unsubscribe = messagesApi.subscribeToNewConversations(() => {
      console.log('Nueva conversación detectada');
      fetchConversations();
    });

    conversationSubscriptionRef.current = unsubscribe;
  }, [fetchConversations]);

  // =========================================================================
  // EFECTOS
  // =========================================================================

  /**
   * Cargar conversaciones al montar el componente
   */
  useEffect(() => {
    if (autoFetch) {
      fetchConversations();
      subscribeToNewConversations();
    }

    // Cleanup al desmontar
    return () => {
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current();
      }
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current();
      }
    };
  }, [autoFetch, fetchConversations, subscribeToNewConversations]);

  /**
   * Suscribirse a mensajes cuando cambie la conversación actual
   */
  useEffect(() => {
    if (currentConversationId) {
      subscribeToCurrentConversation(currentConversationId);
    }
  }, [currentConversationId, subscribeToCurrentConversation]);

  // =========================================================================
  // FUNCIONES DE UTILIDAD
  // =========================================================================

  /**
   * Cambiar a una conversación específica
   */
  const selectConversation = useCallback((otherUserId: string) => {
    fetchMessages(otherUserId);
  }, [fetchMessages]);

  /**
   * Limpiar mensajes actuales
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    
    // Limpiar suscripción de mensajes
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current();
      messageSubscriptionRef.current = null;
    }
  }, []);

  /**
   * Refrescar todos los datos
   */
  const refreshAll = useCallback(async () => {
    await fetchConversations();
    if (currentConversationId) {
      await fetchMessages(currentConversationId);
    }
  }, [fetchConversations, fetchMessages, currentConversationId]);

  // =========================================================================
  // RETORNO DEL HOOK
  // =========================================================================

  return {
    // Estados
    conversations,
    messages,
    loading,
    error,
    currentConversationId,
    
    // Funciones de carga
    fetchConversations,
    fetchMessages,
    
    // Funciones de acción
    sendMessage,
    markAsRead,
    selectConversation,
    
    // Funciones de utilidad
    clearMessages,
    refreshAll,
    
    // Aliases para compatibilidad
    refreshConversations: fetchConversations,
    loadMessages: fetchMessages,
  };
}

export default useMessages;

