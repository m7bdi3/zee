import MessagesBody from "./messages-body";
import { conversationWithData } from "@/utils/supabase/types/types";

interface props {
  conversations: conversationWithData[];
}

const MainMessages = ({ conversations }: props) => {
  return (
    <div>
      {conversations!.map((conversation) => (
        <MessagesBody
          key={conversation.id}
          conversation={conversation as conversationWithData}
        />
      ))}
    </div>
  );
};

export default MainMessages;
