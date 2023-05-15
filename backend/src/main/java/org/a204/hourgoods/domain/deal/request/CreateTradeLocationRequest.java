package org.a204.hourgoods.domain.deal.request;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "실시간 위치 확인 요청")
public class CreateTradeLocationRequest {
	@NotNull
	@Schema(description = "관련 채팅방 id")
	private Long chattingRoomId;
}
