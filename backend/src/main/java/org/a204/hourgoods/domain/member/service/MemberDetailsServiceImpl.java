package org.a204.hourgoods.domain.member.service;

import org.a204.hourgoods.domain.member.entity.AdminDetails;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.domain.member.exception.UserNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MemberDetailsServiceImpl implements UserDetailsService {

	private final MemberRepository memberRepository;
	@Value("${spring.security.user.name}")
	private String adminId;

	@Override
	public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {

		if (!input.equals(adminId)) {
			Member member = memberRepository.findByEmail(input)
				.orElseThrow(UserNotFoundException::new);
			return new MemberDetails(member);
		} else
			return new AdminDetails(input);
	}
}