package org.a204.hourgoods.domain.member.repository;

import java.util.Optional;

import org.a204.hourgoods.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
	Optional<Member> findByEmail(String email);
	boolean existsByNickname(String nickname);

	Optional<Member> findByNickname(String nickname);

}