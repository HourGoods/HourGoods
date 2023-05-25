/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/react-in-jsx-scope */
import { useRef, useEffect } from "react";
import { scrollToBottom } from "@utils/scrollToBottom";
import { PrivatChatMessage } from "..";

interface Props {
  chatMsgList: PrivatChatMessage[];
  userName: string;
}

export default function index({ chatMsgList, userName }: Props) {
  const chatMsgListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom(chatMsgListRef.current);
  }, [chatMsgList]);

  return (
    <div className="private-chatroom-content-container">
      {chatMsgList.length === 0 ? (
        <div className="private-no-chat-yet">
          <p>아직 채팅이 없어요</p>
          <p>먼저 채팅을 시작해보세요!</p>
        </div>
      ) : (
        chatMsgList.map((message: PrivatChatMessage, index: number) => {
          const isMy = userName === message.nickname;
          const messageClassName = isMy ? "its-me-chat" : "not-me-chat";
          return (
            <div key={index} className={messageClassName}>
              {isMy ? (
                <p className="its-me-chatbox">{message.content}</p>
              ) : (
                <div className="not-me-chat-message">
                  <p className="not-me-name">{message.nickname}</p>
                  <p className="not-me-message">{message.content}</p>
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={chatMsgListRef}></div>
    </div>
  );
}
