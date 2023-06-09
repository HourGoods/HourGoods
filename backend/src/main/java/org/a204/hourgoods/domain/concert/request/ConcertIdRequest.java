package org.a204.hourgoods.domain.concert.request;

import javax.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "공연 아이디 조회 요청")
public class ConcertIdRequest {
	@NotNull
	@Schema(description = "kopisConertId")
	private String kopisConcertId;
}
