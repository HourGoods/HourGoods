/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-array-index-key */
import React from "react";
import { UserStateAtom } from "@recoils/user/Atom";
import { useRecoilValue } from "recoil";
import { ChatMessage } from "..";

interface Props {
  msgList: ChatMessage[];
}

export default function index({ msgList }: Props) {
  const userInfo = useRecoilValue(UserStateAtom);
  const userName = userInfo.nickname;

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
      </div>
    </div>
  );
}

// const messageClassName =
//   message.nickname === userName ? "its-me-chat" : "not-me-chat";
// return (
//   <div key={index} className={messageClassName}>
//     {message.nickname !== userName && (
//       <img src={message.imageUrl} alt="프로필사진" />
//     )}
//     <div className="not-me-chat-message">
//       <p className="not-me-chat-name">{message.nickname}</p>
//       <p className="not-me-chat-message">{message.content}</p>
//     </div>
//   </div>
// );

// <div className="not-me-chat">
//         <UserCircleIcon />
//         <div className="not-me-chat-message">
//           <p className="not-me-chat-name">{nickname}</p>
//           <p className="not-me-chat-message">{messages}</p>
//         </div>
//       </div>
//       <div className="its-me-chat">
//         <p className="its-me-chat-box">내가 보낸 메세지</p>
//       </div>
//       <div className="not-me-chat">
//         <UserCircleIcon />
//         <div className="not-me-chat-message">
//           <p className="not-me-chat-name">아이유사랑해</p>
//           <p className="not-me-chat-message">남이 보낸 메세지</p>
//         </div>
//       </div>
