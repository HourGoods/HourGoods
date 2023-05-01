package org.a204.hourgoods.domain.concert.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "생성된 공연 id 응답")
public class ConcertIdResponse {
	@Schema(description = "공연 id")
	private Long concertId;
}
