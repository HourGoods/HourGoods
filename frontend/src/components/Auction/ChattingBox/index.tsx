/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef } from "react";
import { UserStateAtom } from "@recoils/user/Atom";
import { useRecoilValue } from "recoil";
import { scrollToBottom } from "@utils/scrollToBottom";
import { ChatMessage, InoutMessage } from "..";

interface Props {
  msgList: ChatMessage[];
  inoutMsgList: InoutMessage[];
}

export default function index({ msgList, inoutMsgList }: Props) {
  const chatMsgListRef = useRef<HTMLDivElement | null>(null);
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname;

  useEffect(() => {
    scrollToBottom(chatMsgListRef.current);
  }, [inoutMsgList, msgList]);

  return (
    <div className="chattingbox-all-container">
      <div ref={chatMsgListRef} className="private-chatroom-content-container">
        {msgList.map((message: ChatMessage, index: number) => {
          const isMe = message.nickname === userName;
          const messageClassName = isMe ? "its-me-chat" : "not-me-chat";
          const join = message.messageType === "JOIN";

          return (
            <React.Fragment key={index}>
              {message.content && isMe ? (
                <div className={messageClassName}>
                  <p className="its-me-chat-box">{message.content}</p>
                </div>
              ) : (
                <div>
                  {message.imageUrl && (
                    <div className={messageClassName}>
                      <div className="not-me-chat-message">
                        <img src={message.imageUrl} alt="프로필사진" />
                        <p className="not-me-chat-name">{message.nickname}</p>
                        <p className="not-me-chat-message">{message.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {join && (
                <div className="in-out-message">
                  <p>{message.nickname}님이 참여하였습니다.</p>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
