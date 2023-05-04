package org.a204.hourgoods.domain.deal.contorller;

import javax.validation.Valid;

import org.a204.hourgoods.domain.deal.request.SharingApplyRequest;
import org.a204.hourgoods.domain.deal.response.SharingResultResponse;
import org.a204.hourgoods.domain.deal.service.SharingService;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/deal/sharing")
@RestController
@RequiredArgsConstructor
@Tag(name = "Sharing", description = "무료 나눔 관련 API")
@Slf4j
public class SharingController {
	private final SharingService sharingService;
	@PostMapping("/apply")
	@Operation(summary = "무료나눔 신청 API", description = "무료 나눔 신청 결과 반환, 순위 반환, -1은 정원이 가득찬 경우")
	@ApiResponse(responseCode = "404", description = "1. D200 해당 id에 해당하는 거래가 없습니다.")
	@ApiResponse(responseCode = "400", description = "1. D400 아직 거래가 시작되지 않았습니다. \t\n 2. D500 거래 타입이 올바르지 않습니다.")
	public BaseResponse<SharingResultResponse> applySharing(@AuthenticationPrincipal MemberDetails memberDetails, @Valid @RequestBody SharingApplyRequest request) {
		Member member = memberDetails.getMember();
		Long dealId = request.getDealId();
		SharingResultResponse response = SharingResultResponse.builder()
			.result(sharingService.applySharing(member, dealId)).build();
		return new BaseResponse<>(response);
	}
}
