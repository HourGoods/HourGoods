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
  const [isNewMessage, setIsNewMessage] = useState<boolean>(false);

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
    console.log("isScrollAtBottom", isScrollAtBottom);
    if (isScrollAtBottom) {
      scrollToBottom(chatBottomRef.current);
    }
    // else {
    //   setIsNewMessage(true);
    // }
  }, [msgList, inoutMsgList, isScrollAtBottom]);

  const handleScroll = () => {
    const element = chatMsgListRef?.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isScrolledToBottom =
        Math.abs(scrollTop + clientHeight - scrollHeight) <= 50;
      setIsScrollAtBottom(isScrolledToBottom);
    }
  };

  // const handleButtonClick = () => {
  //   setIsNewMessage(false);
  //   scrollToBottom(chatBottomRef.current);
  // };

  return (
    <div ref={chatMsgListRef} className="chattingbox-all-container">
      <div className="private-chatroom-content-container">
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
                        <div>
                          <img src={`https://d2uxndkqa5kutx.cloudfront.net/${message.imageUrl}`} alt="프로필사진" />
                        </div>
                        <div>
                          <p className="not-me-chat-name">{message.nickname}</p>
                          <p>{message.content}</p>
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
            </React.Fragment>
          );
        })}
        {/* {isNewMessage && (
          <button
            type="button"
            className="new-message-button"
            onClick={handleButtonClick}
          >
            새로운 메시지가 도착했습니다. 최하단으로 이동
          </button>
        )} */}
        <div ref={chatBottomRef}></div>
      </div>
    </div>
  );
}
