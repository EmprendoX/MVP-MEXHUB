/**
 * API DE MENSAJERÍA - HUBMEX MVP
 * 
 * Funciones para manejar mensajería interna entre usuarios
 * Basado en: taskmaster/database.txt (tabla messages)
 */

import { supabase } from '@/lib/supabaseClient';
import { getUserProfile } from '@/lib/api/auth';
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
  messageData: Omit<MessageInsert, 'id' | 'created_at' | 'sender_id'>
): Promise<APIResult<Message>> {
  try {
    // Obtener usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Usuario no autenticado',
      };
    }

    // Verificar que el usuario tiene perfil en public.users
    const userProfile = await getUserProfile(user.id);
    if (!userProfile) {
      console.error('❌ Usuario no tiene perfil en public.users. ID:', user.id);
      return {
        success: false,
        error: 'Tu perfil de usuario no está completo. Por favor, completa tu registro primero.',
      };
    }

    // Verificar que el receptor también tiene perfil
    const receiverProfile = await getUserProfile(messageData.receiver_id);
    if (!receiverProfile) {
      console.error('❌ Receptor no tiene perfil en public.users. ID:', messageData.receiver_id);
      return {
        success: false,
        error: 'El usuario receptor no tiene un perfil válido.',
      };
    }

    // Agregar sender_id automáticamente
    const fullMessageData = {
      ...messageData,
      sender_id: user.id,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([fullMessageData])
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

    // Query corregida: obtener mensajes de la conversación entre dos usuarios específicos
    // Hacer dos queries para asegurar que funcione correctamente con PostgREST
    // Caso 1: Usuario actual es sender, otro usuario es receiver
    const { data: data1, error: error1 } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .eq('receiver_id', otherUserId)
      .order('created_at', { ascending: true })
      .limit(limit);
    
    if (error1) {
      console.error('❌ Error obteniendo mensajes (caso 1):', error1.message);
      return {
        success: false,
        error: error1.message,
      };
    }

    // Caso 2: Otro usuario es sender, usuario actual es receiver
    const { data: data2, error: error2 } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', otherUserId)
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: true })
      .limit(limit);
    
    if (error2) {
      console.error('❌ Error obteniendo mensajes (caso 2):', error2.message);
      return {
        success: false,
        error: error2.message,
      };
    }

    // Combinar resultados y ordenar por fecha
    const allMessages = [...(data1 || []), ...(data2 || [])];
    const uniqueMessages = allMessages.filter((msg, index, self) =>
      index === self.findIndex(m => m.id === msg.id)
    );
    
    // Ordenar por fecha ascendente y limitar
    const sortedMessages = uniqueMessages
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .slice(0, limit);

    return {
      success: true,
      data: sortedMessages,
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
  let channel: ReturnType<typeof supabase.channel> | null = null;
  let isUnsubscribed = false;
  
  // Obtener usuario de forma asíncrona y crear suscripción
  supabase.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user;
    
    if (!user) {
      console.error('Usuario no autenticado para suscripción de mensajes');
      return;
    }

    if (isUnsubscribed) {
      // Si ya se canceló la suscripción, no crear el channel
      return;
    }

    // Crear channel con nombre único
    const channelName = `messages:${user.id}:${otherUserId}`;
    channel = supabase.channel(channelName);

    // Suscribirse a mensajes donde el usuario actual es sender y otro es receiver
    channel = channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${user.id},receiver_id=eq.${otherUserId}`
      },
      (payload) => {
        console.log('Nuevo mensaje recibido (caso 1):', payload.new);
        callback(payload.new as Message);
      }
    );

    // Suscribirse a mensajes donde otro usuario es sender y usuario actual es receiver
    channel = channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${otherUserId},receiver_id=eq.${user.id}`
      },
      (payload) => {
        console.log('Nuevo mensaje recibido (caso 2):', payload.new);
        callback(payload.new as Message);
      }
    );

    // Suscribirse al channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Suscrito a mensajes con ${otherUserId}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Error en suscripción de mensajes');
      }
    });
  });

  // Retornar función de cleanup
  return () => {
    isUnsubscribed = true;
    if (channel) {
      supabase.removeChannel(channel);
      console.log(`🔌 Suscripción de mensajes cancelada para ${otherUserId}`);
    }
  };
}

/**
 * Suscribirse a nuevas conversaciones en tiempo real
 * @param callback Función a ejecutar cuando llegue un nuevo mensaje (nueva conversación)
 * @returns Función para cancelar la suscripción
 */
export function subscribeToNewConversations(callback: () => void): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;
  let isUnsubscribed = false;
  
  // Obtener usuario de forma asíncrona y crear suscripción
  supabase.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user;
    
    if (!user) {
      console.error('Usuario no autenticado para suscripción de conversaciones');
      return;
    }

    if (isUnsubscribed) {
      // Si ya se canceló la suscripción, no crear el channel
      return;
    }

    // Crear channel con nombre único por usuario
    const channelName = `new_conversations:${user.id}`;
    channel = supabase.channel(channelName);

    // Suscribirse a nuevos mensajes donde el usuario actual es el receiver
    channel = channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      },
      (payload) => {
        console.log('Nueva conversación iniciada:', payload.new);
        callback();
      }
    );

    // Suscribirse al channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Suscrito a nuevas conversaciones');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Error en suscripción de nuevas conversaciones');
      }
    });
  });

  // Retornar función de cleanup
  return () => {
    isUnsubscribed = true;
    if (channel) {
      supabase.removeChannel(channel);
      console.log('🔌 Suscripción de nuevas conversaciones cancelada');
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
