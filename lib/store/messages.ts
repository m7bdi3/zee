import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type Imessage = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string | null;
  file_url: string | null;
  is_edit: boolean;
  conversation_id: string;
  senderProfile: {
    id: string;
    username: string;
    avatar_url: string | null;
    firstname: string;
    lastname: string;
  };
  receiverProfile: {
    id: string;
    username: string;
    avatar_url: string | null;
    firstname: string;
    lastname: string;
  };
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  addMessage: (message: Imessage) => void;
  setActionMessage: (message: Imessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: Imessage) => void;
  setOptimisticIds: (id: string) => void;
  setMesssages: (messages: Imessage[]) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  optimisticIds: [],
  actionMessage: undefined,
  setMesssages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE,
    })),
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),

  addMessage: (newMessage) => {
    set((state) => {
      const messageExists = state.messages.some(
        (message) => message.id === newMessage.id
      );
      if (!messageExists) {
        return {
          ...state,
          messages: [...state.messages, newMessage],
        };
      }
      return state;
    });
  },
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      };
    }),
  optimisticUpdateMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updateMessage.id) {
            (message.content = updateMessage.content),
              (message.is_edit = updateMessage.is_edit);
          }
          return message;
        }),
      };
    }),
}));
