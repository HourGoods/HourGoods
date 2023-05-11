package org.a204.hourgoods.domain.deal.contorller;

import javax.validation.Valid;

import org.a204.hourgoods.domain.deal.request.CreateTradeLocationRequest;
import org.a204.hourgoods.domain.deal.request.TradeMessageRequest;
import org.a204.hourgoods.domain.deal.response.CreateTradeLocationResponse;
import org.a204.hourgoods.domain.deal.response.TradeMessageResponse;
import org.a204.hourgoods.domain.deal.service.TradeService;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/deal/trade")
@RestController
@RequiredArgsConstructor
@Tag(name = "Trade", description = "일대일 거래 관련 API")
@Slf4j
public class TradeController {
	private final TradeService tradeService;

	@Operation(summary = "거래자 실시간 위치 확인 API", description = "거래자의 위치정보 확인을 위해 소켓 연결 성공")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "위치 정보 전송 성공", content = @Content(schema = @Schema(implementation = CreateTradeLocationResponse.class))),
		@ApiResponse(responseCode = "400", description = "1. D200 해당 id에 해당하는 거래가 없습니다.\n"
			+ "2. M500 판매자 닉네임과 일치하는 사용자가 없습니다.\n"
			+ "3. M501 판매자와 거래 등록자의 id가 일치하지 않습니다.\n"
			+ "4. M600 구매자 닉네임과 일치하는 사용자가 없습니다.")
	})
	@PostMapping
	public BaseResponse<CreateTradeLocationResponse> createTradeLocation(
		@Valid @RequestBody CreateTradeLocationRequest request) {
		CreateTradeLocationResponse response = tradeService.createTradeLocation(request);
		return new BaseResponse<>(response);
	}

	@MessageMapping("/meet/{dealId}")
	@SendTo("/topic/meet/${dealId}")
	public TradeMessageResponse updateTradeLocation(@Payload TradeMessageRequest request) {
		TradeMessageResponse response = tradeService.updateTradeLocation(request);
		return response;
	}
}
