/* eslint-disable react/self-closing-comp */
/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from "react";
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
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname;
  const [isScrollAtBottom, setIsScrollAtBottom] = useState<boolean>(true);
  // const [isNewMessage, setIsNewMessage] = useState<boolean>(false);
  const [latestMessage, setLatestMessage] = useState<ChatMessage | null>(null);

  useEffect(() => {
    if (chatMsgListRef.current) {
      chatMsgListRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatMsgListRef.current) {
        chatMsgListRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chatMsgListRef.current]);

  useEffect(() => {
    if (isScrollAtBottom) {
      scrollToBottom(chatBottomRef.current);
    } else {
      // setIsNewMessage(true);
      const lastMessage = msgList[msgList.length - 1];
      setLatestMessage(lastMessage);
    }
  }, [msgList, inoutMsgList, isScrollAtBottom]);

  const handleScroll = () => {
    const element = chatMsgListRef?.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isScrolledToBottom =
        Math.abs(scrollTop + clientHeight - scrollHeight) <= 100;
      setIsScrollAtBottom(isScrolledToBottom);
    }
  };

  const handleButtonClick = () => {
    // setIsNewMessage(false);
    setLatestMessage(null);
    scrollToBottom(chatBottomRef.current);
  };

  return (
    <div ref={chatMsgListRef} className="chattingbox-all-container">
      <div className="private-chatroom-content-container">
        {msgList.map((message: ChatMessage, index: number) => {
          const isMe = message.nickname === userName;
          const messageClassName = isMe ? "its-me-chat" : "not-me-chat";
          const join = message.messageType === "JOIN";
          const isLatestMessage = latestMessage === message;
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
                        <div>
                          {message.imageUrl && message.imageUrl !== "" ? (
                            <img
                              src={`https://d2uxndkqa5kutx.cloudfront.net/${message.imageUrl}`}
                              alt="프로필사진"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="not-me-chat-name">{message.nickname}</p>
                          <p className="not-me-chat-content">
                            {message.content}
                          </p>
                        </div>
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
              {!isScrollAtBottom && isLatestMessage && (
                // 새메시지 하단 이동 버튼
                // 스크롤이 하단에 있지 않고 최신메세지가 있다면
                <button
                  type="button"
                  className="new-message-button"
                  onClick={handleButtonClick}
                >
                  <img
                    src={`https://d2uxndkqa5kutx.cloudfront.net/${message.imageUrl}`}
                    alt="프로필사진"
                  />
                  {message.nickname}: {message.content}
                </button>
              )}
            </React.Fragment>
          );
        })}
        <div className="chat-bottom-ref" ref={chatBottomRef}></div>
      </div>
    </div>
  );
}
