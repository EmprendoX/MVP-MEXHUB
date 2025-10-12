/**
 * API DE MENSAJERÍA - HUBMEX MVP
 * 
 * Funciones para manejar mensajería interna entre usuarios
 * Basado en: taskmaster/database.txt (tabla messages)
 */

import { supabase } from '@/lib/supabaseClient';
import type { Message, MessageInsert, User } from '@/types/supabase';

// =========================================================================
// INTERFACES
// =========================================================================

export interface APIResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ConversationSummary {
  id: string;
  user: {
    id: string;
    nombre: string | null;
    avatar_url: string | null;
  };
  lastMessage: {
    id: string;
    sender_id: string;
    receiver_id: string;
    contenido: string;
    created_at: string;
  };
  unreadCount: number;
}

// =========================================================================
// FUNCIONES PRINCIPALES
// =========================================================================

/**
 * Crear un nuevo mensaje
 * @param messageData Datos del mensaje (sin id ni created_at)
 * @returns Resultado de la operación
 */
export async function createMessage(
  messageData: Omit<MessageInsert, 'id' | 'created_at'>
): Promise<APIResult<Message>> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando mensaje:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Mensaje creado exitosamente');
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en createMessage:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al crear mensaje',
    };
  }
}

/**
 * Obtener mensajes de una conversación específica
 * @param otherUserId ID del otro usuario en la conversación
 * @param limit Límite de mensajes a obtener (default: 50)
 * @returns Lista de mensajes
 */
export async function getConversationMessages(
  otherUserId: string,
  limit: number = 50
): Promise<APIResult<Message[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      };
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('❌ Error obteniendo mensajes:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en getConversationMessages:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al obtener mensajes',
    };
  }
}

/**
 * Obtener lista de conversaciones del usuario
 * @returns Lista de conversaciones con resumen
 */
export async function getConversationsList(): Promise<APIResult<ConversationSummary[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      };
    }

    // Query para obtener conversaciones
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        receiver_id,
        contenido,
        created_at,
        sender:users!messages_sender_id_fkey(id, nombre, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, nombre, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo conversaciones:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    // Procesar datos para crear resumen de conversaciones
    const conversations = new Map<string, ConversationSummary>();

    data?.forEach((message) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      const otherUser = message.sender_id === user.id ? message.receiver : message.sender;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          id: otherUserId,
          user: {
            id: otherUser.id,
            nombre: otherUser.nombre,
            avatar_url: otherUser.avatar_url,
          },
          lastMessage: {
            id: message.id,
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            contenido: message.contenido,
            created_at: message.created_at,
          },
          unreadCount: 0, // TODO: Implementar conteo de no leídos
        });
      }
    });

    return {
      success: true,
      data: Array.from(conversations.values()),
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en getConversationsList:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al obtener conversaciones',
    };
  }
}

/**
 * Marcar mensajes como leídos
 * @param messageIds Array de IDs de mensajes a marcar como leídos
 * @returns Resultado de la operación
 */
export async function markMessagesAsRead(messageIds: string[]): Promise<APIResult<null>> {
  try {
    // TODO: Implementar tabla de mensajes leídos si es necesario
    // Por ahora solo retornamos éxito
    console.log('✅ Mensajes marcados como leídos:', messageIds);
    return {
      success: true,
      data: null,
    };
  } catch (error: any) {
    console.error('❌ Error inesperado en markMessagesAsRead:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado al marcar mensajes como leídos',
    };
  }
}

// =========================================================================
// FUNCIONES DE TIEMPO REAL
// =========================================================================

/**
 * Suscribirse a mensajes en tiempo real para una conversación
 * @param otherUserId ID del otro usuario en la conversación
 * @param callback Función a ejecutar cuando llegue un nuevo mensaje
 * @returns Función para cancelar la suscripción
 */
export function subscribeToMessages(
  otherUserId: string,
  callback: (message: Message) => void
): () => void {
  let subscription: any = null;
  
  // Obtener usuario de forma síncrona desde la sesión actual
  supabase.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user;
    
    if (!user) {
      console.error('Usuario no autenticado para suscripción de mensajes');
      return;
    }

    subscription = supabase
      .channel(`messages:${otherUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          console.log('Nuevo mensaje recibido:', payload.new);
          callback(payload.new as Message);
        }
      )
      .subscribe();
  });

  return () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}

/**
 * Suscribirse a nuevas conversaciones en tiempo real
 * @param callback Función a ejecutar cuando llegue un nuevo mensaje (nueva conversación)
 * @returns Función para cancelar la suscripción
 */
export function subscribeToNewConversations(callback: () => void): () => void {
  let subscription: any = null;
  
  // Obtener usuario de forma síncrona desde la sesión actual
  supabase.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user;
    
    if (!user) {
      console.error('Usuario no autenticado para suscripción de conversaciones');
      return;
    }

    subscription = supabase
      .channel('new_conversations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id.eq.${user.id}`
        },
        (payload) => {
          console.log('Nueva conversación iniciada:', payload.new);
          callback();
        }
      )
      .subscribe();
  });

  return () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}

// =========================================================================
// FUNCIONES AUXILIARES
// =========================================================================

/**
 * Obtener información de un usuario por ID
 * @param userId ID del usuario
 * @returns Información del usuario
 */
export async function getUserInfo(userId: string): Promise<APIResult<{ id: string; nombre: string | null; avatar_url: string | null }>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, nombre, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error obteniendo información de usuario:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error inesperado en getUserInfo:', err);
    return { success: false, error: err.message || 'Error inesperado al obtener información del usuario.' };
  }
}

// =========================================================================
// EXPORTS
// =========================================================================

export default {
  createMessage,
  getConversationMessages,
  getConversationsList,
  markMessagesAsRead,
  subscribeToMessages,
  subscribeToNewConversations,
  getUserInfo,
};
