package org.a204.hourgoods.domain.deal.service;

import java.time.LocalDateTime;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealTypeMissMatchException;
import org.a204.hourgoods.domain.deal.exception.DealYetStartException;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.a204.hourgoods.domain.deal.repository.SharingRepository;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.participant.entity.Participant;
import org.a204.hourgoods.domain.participant.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Service;

@Service
public class SharingService {
	private final DealRepository dealRepository;
	private final SharingRepository sharingRepository;
	private final RedisTemplate<String, Integer> redisTemplate;
	private ValueOperations<String, Integer> valueOperations;
	private final ParticipantRepository participantRepository;

	@Autowired
	public SharingService(DealRepository dealRepository, SharingRepository sharingRepository, RedisTemplate redisTemplate,
		ParticipantRepository participantRepository) {
		this.dealRepository = dealRepository;
		this.sharingRepository = sharingRepository;
		RedisTemplate<String, Integer> configuredTemplate = new RedisTemplate<>();
		configuredTemplate.setConnectionFactory(redisTemplate.getConnectionFactory());
		configuredTemplate.setKeySerializer(new StringRedisSerializer());
		configuredTemplate.setValueSerializer(new GenericToStringSerializer<>(Integer.class));
		configuredTemplate.afterPropertiesSet();
		this.redisTemplate = configuredTemplate;
		this.valueOperations = this.redisTemplate.opsForValue();
		this.participantRepository = participantRepository;
	}

	public Integer applySharing(Member member, Long dealId) {
		Deal deal = dealRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
		if (deal.getStartTime().isAfter(LocalDateTime.now())) {
			throw new DealYetStartException();
		}
		Sharing sharing = sharingRepository.findById(dealId).orElseThrow(DealTypeMissMatchException::new);
		Integer sharingLimit = sharing.getLimitation();
		String sharingCounterKey = "sharing_counter_" + sharing.getId().toString();
		Integer sharingCounter = valueOperations.get(sharingCounterKey);
		Integer rank;
		if (sharingCounter == null) {
			valueOperations.set(sharingCounterKey, 1);
			rank = 1;
		} else if (sharingCounter < sharingLimit) {
			int newCounter = valueOperations.increment(sharingCounterKey).intValue();
			rank = newCounter;
		} else {
			return -1;
		}
		Participant participant = Participant.builder()
			.rank(rank)
			.deal(deal)
			.member(member).build();
		participantRepository.save(participant);
		return rank;
	}
}
