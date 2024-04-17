import { Topic } from "@/utils/supabase/types/types";
import { create } from "zustand";

interface TopicState {
  topic: Topic[];
  addTopic: (topic: Topic) => void;
}

export const useTopic = create<TopicState>()((set) => ({
  topic: [],
  addTopic: (newTopic) => {
    set((state) => {
      const topicExists = state.topic.some((topic) => topic.slug === newTopic.slug);
      if (!topicExists) {
        return {
          ...state,
          topic: [...state.topic, newTopic],
        };
      }
      return state;
    });
  },
}));
