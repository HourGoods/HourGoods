package org.a204.hourgoods.domain.deal.contorller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;
import org.a204.hourgoods.domain.deal.service.AuctionService;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auction")
@Tag(name = "Auction", description = "경매 관련 API")
public class AuctionController {
    private final AuctionService auctionService;
    @GetMapping("/available")
    @Operation(summary = "경매 입장 전 호출 API", description = "경매 입장 전 호출하여 에러 없을 때만 입장, 입장 시 기본 정보 반환(현재 최고 입찰가, 참가자 수)")
    @ApiResponses({
        @ApiResponse(responseCode = "404", description = "1. D200, 해당 id에 해당하는 거래가 없습니다."),
        @ApiResponse(responseCode = "400", description = "1. D500, 이미 종료된 거래입니다. \t\n 2. D400, 아직 거래가 시작되지 않았습니다."),
    })
    public BaseResponse<AuctionEntryResponse> auctionEntry(@AuthenticationPrincipal MemberDetails memberDetails, @RequestParam Long dealId) {
        Member member = memberDetails.getMember();
        AuctionEntryResponse auctionEntryResponse = auctionService.entryAuction(member, dealId);
        return new BaseResponse<>(auctionEntryResponse);
    }
}
