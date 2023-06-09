package org.a204.hourgoods.domain.deal.service;

import java.time.LocalDateTime;

import javax.annotation.PostConstruct;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealTypeMissMatchException;
import org.a204.hourgoods.domain.deal.exception.DealYetStartException;
import org.a204.hourgoods.domain.deal.exception.SharingRankException;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.a204.hourgoods.domain.deal.repository.SharingRepository;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.participant.entity.Participant;
import org.a204.hourgoods.domain.participant.repository.ParticipantRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SharingService {
	private final DealRepository dealRepository;
	private final SharingRepository sharingRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private ZSetOperations<String, String> zSetOperations;
	private final ParticipantRepository participantRepository;

	@PostConstruct
	private void init() {
		zSetOperations = redisTemplate.opsForZSet();
	}

	public Integer applySharing(Member member, Long dealId) {
		Deal deal = dealRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
		if (deal.getStartTime().isAfter(LocalDateTime.now())) {
			throw new DealYetStartException();
		}
		Sharing sharing = sharingRepository.findById(dealId).orElseThrow(DealTypeMissMatchException::new);
		Integer sharingLimit = sharing.getLimitation();
		String userId = member.getId().toString();
		String sharingKey = "sharing:" + dealId; // 각 sharing에 대한 고유한 키를 생성
		Double userScore = zSetOperations.score(sharingKey, userId);

		if (userScore != null) {
			// 이미 신청한 사용자
			Long rank = zSetOperations.rank(sharingKey, userId);
			if (rank == null) throw new SharingRankException();
			return rank.intValue() + 1;
		}

		// 사용자가 처음 신청하는 경우
		zSetOperations.add(sharingKey, userId, System.currentTimeMillis());
		Long rank = zSetOperations.rank(sharingKey, userId);
		if (rank == null) throw new SharingRankException();
		Integer output;
		if (rank < sharingLimit) {
			output = rank.intValue() + 1; // 순위는 0부터 시작하므로 1을 더해줍니다.
		} else {
			// 정원 초과
			zSetOperations.remove(sharingKey, userId);
			return -1;
		}
		Participant participant = Participant.builder()
			.ranking(output)
			.deal(deal)
			.member(member).build();
		participantRepository.save(participant);
		return output;
	}
}
