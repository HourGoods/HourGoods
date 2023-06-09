package org.a204.hourgoods.domain.participant.repository;

import org.a204.hourgoods.domain.participant.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}
