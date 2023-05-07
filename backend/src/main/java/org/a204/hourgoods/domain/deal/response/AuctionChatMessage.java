package org.a204.hourgoods.domain.deal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuctionChatMessage {
      private String messageType;
      private String imageUrl;
      private String nickname;
      private String content;
      private Integer participantCount;
}
