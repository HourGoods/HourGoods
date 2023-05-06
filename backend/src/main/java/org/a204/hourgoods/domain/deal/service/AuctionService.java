package org.a204.hourgoods.domain.deal.service;

import lombok.RequiredArgsConstructor;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.exception.DealClosedException;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealYetStartException;
import org.a204.hourgoods.domain.deal.repository.AuctionRedisRepository;
import org.a204.hourgoods.domain.deal.repository.AuctionRepository;
import org.a204.hourgoods.domain.deal.request.AuctionMessage;
import org.a204.hourgoods.domain.deal.response.AuctionChatMessage;
import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuctionService {
    private final AuctionRepository auctionRepository;
    private final AuctionRedisRepository auctionRedisRepository;
    private final MemberRepository memberRepository;
    public AuctionEntryResponse entryAuction(Member member, Long dealId) {
        // 경매 시작 시간이 지났는지 확인
        Auction auction = auctionRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
        if (!auction.getIsAvailable()) throw new DealClosedException();
        if (LocalDateTime.now().isBefore(auction.getStartTime())) throw new DealYetStartException();
        // 해당 dealId로 redis 기록이 있는지 확인
        // 있으면 추가
        if (auctionRedisRepository.isExist(dealId)) {
            return auctionRedisRepository.addParticipant(dealId).toEntryResponse();
        }
        // 없으면 경매 시작 금액으로 생성
        else {
            return auctionRedisRepository.initAuction(auction).toEntryResponse();
        }
    }
    public AuctionChatMessage handleChat(String dealId, AuctionMessage message) {
        Member member = memberRepository.findByNickname(message.getNickname()).orElseThrow(MemberNotFoundException::new);
        return AuctionChatMessage.builder()
                .content(message.getContent())
                .imageUrl(member.getImageUrl())
                .messageType(message.getMessageType())
                .nickname(message.getNickname())
                .participantCount(auctionRedisRepository.getParticipantCount(dealId))
                .build();

    }
}
