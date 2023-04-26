package org.a204.hourgoods.domain.member.entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;

@Getter
public class AdminDetails implements UserDetails {

	private final String adminId;

	public AdminDetails(String adminId) {
		this.adminId = adminId;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(() -> "ROLE_ADMIN");
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return adminId;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}