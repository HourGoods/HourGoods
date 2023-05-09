/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-array-index-key */
import React, { useEffect } from "react";
import { UserStateAtom } from "@recoils/user/Atom";
import { useRecoilValue } from "recoil";
import { ChatMessage, InoutMessage } from "..";

interface Props {
  msgList: ChatMessage[];
  inoutMsgList: InoutMessage[];
}

export default function index({ msgList, inoutMsgList }: Props) {
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname;

  useEffect(() => {
    console.log("inoutmessage list", inoutMsgList);
  }, [inoutMsgList]);

  return (
    <div className="chattingbox-all-container">
      <div className="private-chatroom-content-container">
        {msgList.map((message: ChatMessage, index: number) => {
          const isMe = message.nickname === userName;
          const messageClassName = isMe ? "its-me-chat" : "not-me-chat";
          return (
            <div key={index} className={messageClassName}>
              {isMe ? (
                <p className="its-me-chat-box">{message.content}</p>
              ) : (
                <>
                  <img src={message.imageUrl} alt="프로필사진" />
                  <div className="not-me-chat-message">
                    <p className="not-me-chat-name">{message.nickname}</p>
                    <p className="not-me-chat-message">{message.content}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {inoutMsgList.map((message: InoutMessage, index: number) => {
          const join = message.messageType === "JOIN";
          return (
            <div key={index} className="in-out-message">
              {join ? (
                <p>{message.nickname}님이 참여하였습니다.</p>
              ) : (
                <p>{message.nickname}님이 퇴장하였습니다.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
